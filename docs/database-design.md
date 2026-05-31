# Database Design

## Purpose

The database supports the project proposal for an AI-powered national prescription
analytics and medicine demand dashboard. Its role is to store anonymized prescription
activity, normalize key healthcare reference data, and provide reliable structures for
dashboard reporting, anomaly detection, and medicine demand forecasting.

## Design Goals

- Protect privacy by storing anonymized patient identifiers instead of personal data.
- Support national and regional prescription trend analysis.
- Group demand by medication, medication class, date, facility, and region.
- Keep raw prescription records separate from analytics outputs such as forecasts and
  anomaly alerts.
- Provide ready-to-query views for backend APIs and dashboard charts.
- Preserve import and audit metadata for data quality and traceability.

## Main Entities

`regions`

Stores administrative regions and their populations. Population is included so the
dashboard can calculate normalized indicators such as prescriptions per 100,000 people.

`facilities`

Stores hospitals, clinics, pharmacies, and primary care facilities. Each facility belongs
to one region.

`providers`

Stores prescribing or dispensing provider references. Provider records are linked to a
facility and use internal codes rather than personal names.

`medication_classes`

Stores medicine classification groups, using ATC-style codes such as `J01` for
antibacterials and `R03` for respiratory medicines.

`medications`

Stores the medicines that can appear on prescriptions. Each medication belongs to a
class and includes dosage form, strength, unit of measure, and a critical medicine flag.

`anonymized_patients`

Stores patient-level grouping fields needed for analytics: patient hash, age group, sex,
and home region. The schema does not store names, addresses, national ID numbers, or
contact details.

`import_batches`

Tracks ingestion runs from source systems such as Ministry of Health prescription
exports. It records received, accepted, and rejected counts for data quality monitoring.

`prescriptions`

Stores the prescription header: external reference, patient, provider, facility, region,
prescription timestamp, diagnosis group, and status.

`prescription_items`

Stores the medicine lines inside a prescription. This allows one prescription to contain
multiple medicines while keeping quantities and days of supply at item level.

`demand_forecasts`

Stores machine learning or statistical model outputs. Forecasts are keyed by medicine,
region, date, and model version so multiple model versions can be compared.

`anomaly_alerts`

Stores detected public health or supply-chain signals, including demand spikes,
shortage risk, unusual regional patterns, and data quality alerts.

`audit_log`

Stores important system actions for traceability, such as imports, generated forecasts,
or alert creation.

## Relationship Summary

- One region has many facilities.
- One facility has many providers.
- One medication class has many medications.
- One anonymized patient can have many prescriptions.
- One prescription has many prescription items.
- One medication can appear in many prescription items.
- One medication and region can have many forecasts over time.
- One medication and region can have many anomaly alerts.
- One import batch can produce many prescription records.

## Privacy and Security Assumptions

The schema is designed for anonymized analytics, not direct patient care. Patient
identity is represented by a 64-character hash. Sensitive personal identifiers are
intentionally excluded.

Recommended production controls:

- Restrict write access to ingestion and analytics services.
- Give dashboard users read-only access to views instead of base tables where possible.
- Encrypt backups and database storage.
- Keep source-system identifiers outside the dashboard database unless legally required.
- Log administrative actions through `audit_log`.

## Data Quality Rules

The schema uses constraints to protect data integrity:

- Prescription and medication quantities must be positive.
- Dispensed quantity cannot exceed prescribed quantity.
- Import accepted plus rejected records cannot exceed received records.
- Forecast confidence must be between 0 and 1.
- Forecast lower bounds must not be greater than upper bounds.
- Status and type fields use `CHECK` constraints to prevent invalid categories.
- Core codes are unique, including region codes, facility codes, medication codes, and
  external prescription references.

## Data Quality Checklist

Before prescription data is imported from a source system, the ingestion process should
validate the file against the following checklist:

- Required reference codes exist for region, facility, provider, medication, and
  medication class.
- Patient identifiers are hashed before loading and no direct personal identifiers are
  included in the import file.
- Prescription timestamps are present and use a consistent timezone.
- Quantities are numeric, positive, and use the medication's expected unit of measure.
- Dispensed quantity is blank for issued prescriptions or less than or equal to the
  prescribed quantity.
- Rejected records are counted in `import_batches` with a short rejection reason in the
  batch notes or external ingestion log.
- Forecast and alert generation jobs record the model version or detection rule that
  produced each analytics output.

## Dashboard Views

`v_daily_demand`

Aggregates prescription counts and prescribed/dispensed quantities by date, region,
medicine, and medicine class. This view is suitable for line charts and demand trend
graphs.

`v_regional_demand_summary`

Summarizes total demand by region and calculates prescriptions per 100,000 population.
This supports map views and regional comparison charts.

`v_medication_demand_summary`

Summarizes demand by medicine and medication class. This is useful for ranking the most
requested medicines and identifying critical medicine pressure.

`v_active_alerts`

Shows open and investigating alerts with medicine and region names. This is the main
view for an operational alert panel.

## Example Analytical Questions

- Which region has the highest medicine demand per 100,000 people?
- Which respiratory medicines are increasing fastest this week?
- Are antibiotic prescriptions rising in a specific region?
- Which critical medicines have partial dispensing or shortage-risk alerts?
- How does forecasted demand compare with observed prescription activity?

## Implementation Notes

The implementation targets PostgreSQL because it supports strong constraints, identity
columns, JSONB audit details, timestamp handling, views, and indexing options suitable
for analytics workloads.

Suggested PostgreSQL version: 14 or newer.

Apply files in this order:

```sql
\i database/schema.sql
\i database/seed.sql
```

## Suggested Next Work

After the database part is committed, the rest of the team can build on top of these
tables:

- Backend/API can expose read endpoints based on the dashboard views.
- ML can populate `demand_forecasts` and `anomaly_alerts`.
- Frontend can use `v_daily_demand`, `v_regional_demand_summary`,
  `v_medication_demand_summary`, and `v_active_alerts` for charts and panels.
