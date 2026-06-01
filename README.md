# AI-Powered National Prescription Analytics & Medicine Demand Dashboard

This repository contains the database foundation for a national pharmaceutical demand
and prescription analytics dashboard. The system is designed to ingest anonymized
prescription records, aggregate medicine demand by region and time period, support
forecasting, and surface shortage or outbreak-related anomalies for public health
officials.

## Current Scope

This version completes the database design and documentation work:

- Normalized PostgreSQL schema for prescription analytics
- Seed dataset for local testing and demonstrations
- Reporting views for dashboard/API consumption
- Database design documentation with entities, relationships, assumptions, and usage

## Repository Structure

```text
database/
  schema.sql      PostgreSQL schema, constraints, indexes, and reporting views
  seed.sql        Sample reference data, prescriptions, forecasts, and alerts
  example_queries.sql
                  Example analytical queries for dashboard/API development
docs/
  database-design.md
                  Database design explanation and implementation notes
  api-database-contract.md
                  Mapping between dashboard/API features and database objects
  acceptance-testing.md
                  User-facing acceptance scenarios covered by automated tests
  testing-strategy.md
                  Explanation of development and acceptance test coverage
```

## Database Setup

Use PostgreSQL 14 or newer.

```sql
\i database/schema.sql
\i database/seed.sql
```

If you are using a terminal:

```bash
psql -U postgres -d pharma_dashboard -f database/schema.sql
psql -U postgres -d pharma_dashboard -f database/seed.sql
```

The schema creates an application schema named `pharma` and includes the following
main areas:

- Reference data: regions, facilities, providers, medication classes, medications
- Core records: anonymized patients, prescriptions, prescription items
- Analytics outputs: demand forecasts and anomaly alerts
- Governance: import batches and audit log
- Dashboard views: daily demand, regional demand, medication demand, active alerts

## Example Dashboard Queries

More complete dashboard query examples are available in
`database/example_queries.sql`.

Daily demand trend:

```sql
SELECT *
FROM pharma.v_daily_demand
ORDER BY prescription_date, region_name, medicine_name;
```

Active anomaly alerts:

```sql
SELECT *
FROM pharma.v_active_alerts
ORDER BY severity DESC, detected_at DESC;
```

Forecasted demand:

```sql
SELECT
  f.forecast_date,
  r.region_name,
  m.generic_name,
  f.predicted_quantity,
  f.confidence_score
FROM pharma.demand_forecasts f
JOIN pharma.regions r ON r.region_id = f.region_id
JOIN pharma.medications m ON m.medication_id = f.medication_id
ORDER BY f.forecast_date, r.region_name, m.generic_name;
```

## Project Context

The project proposal defines the goal as a centralized platform for prescription
analytics and medicine demand forecasting. The database design supports that goal by
keeping sensitive patient data anonymized, structuring prescription activity for
aggregation, and storing model outputs separately from raw operational records.

## Tests

The repository includes unit tests for the database artifacts. These tests are written
with Python's standard `unittest` library and do not require external packages.

Run all tests:

```bash
python -m unittest discover -s tests
```

The tests check that:

- Required database tables and dashboard views exist
- Privacy-sensitive patient fields are excluded
- Important integrity constraints and indexes are present
- Seed data covers regions, medicines, prescriptions, forecasts, and alerts
- Acceptance scenarios cover demand monitoring, alert review, forecasting, and privacy

See `docs/testing-strategy.md` for how the development tests and acceptance scenario
tests are organized.
 
