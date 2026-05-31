# Acceptance Testing Notes

These acceptance scenarios describe what a public-health dashboard user should be
able to verify from the database artifacts. They are automated in
`tests/test_acceptance_scenarios.py` so they can be run whenever the project changes.

## Scenario 1: Monitor Daily Medicine Demand

Acceptance criterion: a dashboard user can query daily prescription demand by date,
region, medicine, and medication class without reading raw prescription item tables
directly.

Database support:

- `pharma.v_daily_demand`
- `database/example_queries.sql`

## Scenario 2: Detect Regional Alert Conditions

Acceptance criterion: a dashboard user can see open or investigating alerts for demand
spikes, shortage risks, and unusual regional patterns.

Database support:

- `pharma.v_active_alerts`
- `pharma.anomaly_alerts`
- Seed alert for a Salbutamol demand spike in Polog Region

## Scenario 3: Review Forecasted Demand

Acceptance criterion: a dashboard user can review future medicine demand predictions
with forecast date, predicted quantity, confidence score, and model version.

Database support:

- `pharma.demand_forecasts`
- Forecast query in `database/example_queries.sql`

## Scenario 4: Protect Patient Privacy

Acceptance criterion: dashboard analytics must work with anonymized patient data and
must not require names, phone numbers, email addresses, national IDs, or addresses.

Database support:

- `pharma.anonymized_patients`
- `patient_hash`
- Age group, sex, and home region only
