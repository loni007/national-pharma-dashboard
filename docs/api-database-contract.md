# API Database Contract

This document maps the dashboard features to the database objects that should support
them. It gives the backend and frontend a shared contract without requiring them to
query raw prescription tables directly.

## Dashboard Data Sources

| Dashboard feature | Recommended database source | Purpose |
| --- | --- | --- |
| Daily demand trend | `pharma.v_daily_demand` | Line charts by date, region, medicine, and class |
| Regional heatmap | `pharma.v_regional_demand_summary` | Regional comparisons and demand per 100,000 people |
| Medicine ranking | `pharma.v_medication_demand_summary` | Top medicines and critical medicine monitoring |
| Active alerts | `pharma.v_active_alerts` | Open demand spikes, shortage risks, and unusual patterns |
| Forecast panel | `pharma.demand_forecasts` | Predicted demand by medicine, region, and forecast date |

## Suggested API Shape

The backend can expose these database sources through read-only endpoints:

```text
GET /analytics/demand/daily
GET /analytics/demand/regions
GET /analytics/medications/ranking
GET /analytics/alerts/active
GET /analytics/forecasts
```

Responses should use names that match dashboard language, such as `regionName`,
`medicineName`, `prescriptionCount`, `totalQuantityPrescribed`, `severity`, and
`forecastDate`.

## Write Boundaries

Dashboard users should not write directly to prescription or analytics tables. Writes
should be limited to controlled ingestion and analytics jobs:

- Prescription ingestion writes to `import_batches`, `prescriptions`, and
  `prescription_items`.
- Forecast jobs write to `demand_forecasts`.
- Alert detection jobs write to `anomaly_alerts`.
- Administrative or automated changes can be recorded in `audit_log`.

## Backend Notes

- Prefer querying views for dashboard summaries instead of duplicating aggregation
  logic in route handlers.
- Keep raw patient-level rows out of general dashboard responses.
- Filter by date range, region, and medicine where possible to keep responses small.
- Treat `demand_forecasts.model_version` as part of the response when showing forecast
  provenance.
