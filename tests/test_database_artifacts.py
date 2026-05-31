import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_SQL = (ROOT / "database" / "schema.sql").read_text(encoding="utf-8")
SEED_SQL = (ROOT / "database" / "seed.sql").read_text(encoding="utf-8")
EXAMPLE_QUERIES_SQL = (ROOT / "database" / "example_queries.sql").read_text(encoding="utf-8")


def normalized(sql: str) -> str:
    return re.sub(r"\s+", " ", sql.lower())


class DatabaseSchemaTests(unittest.TestCase):
    def setUp(self):
        self.schema = normalized(SCHEMA_SQL)
        self.seed = normalized(SEED_SQL)
        self.example_queries = normalized(EXAMPLE_QUERIES_SQL)

    def test_required_tables_are_defined(self):
        required_tables = [
            "regions",
            "facilities",
            "providers",
            "medication_classes",
            "medications",
            "anonymized_patients",
            "import_batches",
            "prescriptions",
            "prescription_items",
            "demand_forecasts",
            "anomaly_alerts",
            "audit_log",
        ]

        for table in required_tables:
            with self.subTest(table=table):
                self.assertIn(f"create table {table}", self.schema)

    def test_dashboard_views_are_defined(self):
        required_views = [
            "v_daily_demand",
            "v_regional_demand_summary",
            "v_medication_demand_summary",
            "v_active_alerts",
        ]

        for view in required_views:
            with self.subTest(view=view):
                self.assertIn(f"create view {view}", self.schema)

    def test_patient_table_uses_anonymized_fields_only(self):
        patient_block = self._table_block("anonymized_patients")

        self.assertIn("patient_hash char(64) not null unique", patient_block)
        self.assertIn("age_group varchar(20) not null", patient_block)
        self.assertIn("sex char(1) not null", patient_block)

        forbidden_fields = ["first_name", "last_name", "address", "national_id", "phone", "email"]
        for field in forbidden_fields:
            with self.subTest(field=field):
                self.assertNotIn(field, patient_block)

    def test_integrity_constraints_cover_core_business_rules(self):
        expected_constraints = [
            "quantity_prescribed > 0",
            "quantity_dispensed >= 0",
            "quantity_dispensed <= quantity_prescribed",
            "confidence_score between 0 and 1",
            "records_accepted + records_rejected <= records_received",
            "lower_bound <= upper_bound",
        ]

        for constraint in expected_constraints:
            with self.subTest(constraint=constraint):
                self.assertIn(constraint, self.schema)

    def test_indexes_support_dashboard_queries(self):
        expected_indexes = [
            "idx_prescriptions_region_date",
            "idx_prescription_items_medication",
            "idx_forecasts_region_med_date",
            "idx_alerts_status_severity",
        ]

        for index in expected_indexes:
            with self.subTest(index=index):
                self.assertIn(f"create index {index}", self.schema)

    def test_seed_data_covers_core_demo_workflow(self):
        expected_inserts = [
            "insert into regions",
            "insert into facilities",
            "insert into medication_classes",
            "insert into medications",
            "insert into anonymized_patients",
            "insert into prescriptions",
            "insert into prescription_items",
            "insert into demand_forecasts",
            "insert into anomaly_alerts",
        ]

        for insert in expected_inserts:
            with self.subTest(insert=insert):
                self.assertIn(insert, self.seed)

    def test_seed_data_has_multiple_regions_and_medicines(self):
        region_codes = re.findall(r"\('([a-z]{2})', '[^']+ region'", self.seed)
        medication_codes = re.findall(r"'(med-[a-z]+-[0-9]+)'", self.seed)

        self.assertGreaterEqual(len(set(region_codes)), 5)
        self.assertGreaterEqual(len(set(medication_codes)), 5)

    def test_example_queries_use_dashboard_views(self):
        expected_references = [
            "from v_daily_demand",
            "from v_regional_demand_summary",
            "from v_medication_demand_summary",
            "from v_active_alerts",
            "left join v_daily_demand",
        ]

        for reference in expected_references:
            with self.subTest(reference=reference):
                self.assertIn(reference, self.example_queries)

    def _table_block(self, table_name: str) -> str:
        match = re.search(
            rf"create table {table_name} \((.*?)\);",
            self.schema,
            flags=re.DOTALL,
        )
        self.assertIsNotNone(match, f"Could not find table block for {table_name}")
        return match.group(1)


if __name__ == "__main__":
    unittest.main()
