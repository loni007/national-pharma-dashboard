import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCHEMA_SQL = (ROOT / "database" / "schema.sql").read_text(encoding="utf-8")
SEED_SQL = (ROOT / "database" / "seed.sql").read_text(encoding="utf-8")
EXAMPLE_QUERIES_SQL = (ROOT / "database" / "example_queries.sql").read_text(encoding="utf-8")
ACCEPTANCE_DOCS = (ROOT / "docs" / "acceptance-testing.md").read_text(encoding="utf-8")


def normalized(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower())


class AcceptanceScenarioTests(unittest.TestCase):
    def setUp(self):
        self.schema = normalized(SCHEMA_SQL)
        self.seed = normalized(SEED_SQL)
        self.example_queries = normalized(EXAMPLE_QUERIES_SQL)
        self.acceptance_docs = normalized(ACCEPTANCE_DOCS)

    def test_user_can_monitor_daily_medicine_demand(self):
        # Arrange
        required_outputs = [
            "prescription_date",
            "region_name",
            "medicine_name",
            "prescription_count",
            "total_quantity_prescribed",
        ]

        # Act
        daily_demand_view = self._view_block("v_daily_demand")

        # Assert
        self.assertIn("from v_daily_demand", self.example_queries)
        for output in required_outputs:
            with self.subTest(output=output):
                self.assertIn(output, daily_demand_view)

    def test_user_can_see_regional_alert_conditions(self):
        # Arrange
        expected_alert_signals = ["demand_spike", "shortage_risk", "salbutamol", "polog region"]

        # Act
        active_alerts_view = self._view_block("v_active_alerts")

        # Assert
        self.assertIn("where a.status in ('open', 'investigating')", active_alerts_view)
        for signal in expected_alert_signals:
            with self.subTest(signal=signal):
                self.assertIn(signal, self.seed)

    def test_user_can_review_forecasted_medicine_demand(self):
        # Arrange
        required_forecast_fields = [
            "forecast_date",
            "predicted_quantity",
            "confidence_score",
            "model_version",
        ]

        # Act
        forecast_table = self._table_block("demand_forecasts")

        # Assert
        self.assertIn("from demand_forecasts", self.example_queries)
        for field in required_forecast_fields:
            with self.subTest(field=field):
                self.assertIn(field, forecast_table + self.example_queries)

    def test_patient_privacy_is_preserved_for_dashboard_analytics(self):
        # Arrange
        forbidden_identifiers = ["first_name", "last_name", "phone", "email", "national_id", "address"]

        # Act
        patient_table = self._table_block("anonymized_patients")

        # Assert
        self.assertIn("patient_hash char(64)", patient_table)
        for identifier in forbidden_identifiers:
            with self.subTest(identifier=identifier):
                self.assertNotIn(identifier, patient_table)

    def test_acceptance_scenarios_are_documented(self):
        # Arrange
        expected_scenarios = [
            "monitor daily medicine demand",
            "detect regional alert conditions",
            "review forecasted demand",
            "protect patient privacy",
        ]

        # Act and assert
        for scenario in expected_scenarios:
            with self.subTest(scenario=scenario):
                self.assertIn(scenario, self.acceptance_docs)

    def _table_block(self, table_name: str) -> str:
        match = re.search(
            rf"create table {table_name} \((.*?)\);",
            self.schema,
            flags=re.DOTALL,
        )
        self.assertIsNotNone(match, f"Could not find table block for {table_name}")
        return match.group(1)

    def _view_block(self, view_name: str) -> str:
        match = re.search(
            rf"create view {view_name} as (.*?)(?= create view|$)",
            self.schema,
            flags=re.DOTALL,
        )
        self.assertIsNotNone(match, f"Could not find view block for {view_name}")
        return match.group(1)


if __name__ == "__main__":
    unittest.main()
