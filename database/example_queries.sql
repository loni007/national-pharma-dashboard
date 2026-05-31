SET search_path TO pharma;

-- Daily prescription demand for trend charts.
SELECT
    prescription_date,
    region_name,
    medicine_name,
    prescription_count,
    total_quantity_prescribed
FROM v_daily_demand
ORDER BY prescription_date, region_name, medicine_name;

-- Regional demand normalized by population for heatmap coloring.
SELECT
    region_name,
    population,
    prescription_count,
    total_quantity_prescribed,
    prescriptions_per_100k
FROM v_regional_demand_summary
ORDER BY prescriptions_per_100k DESC;

-- Highest-demand medicines for dashboard ranking cards.
SELECT
    generic_name,
    class_name,
    is_critical,
    prescription_count,
    total_quantity_prescribed,
    latest_prescription_at
FROM v_medication_demand_summary
ORDER BY total_quantity_prescribed DESC NULLS LAST;

-- Open alerts for public-health monitoring.
SELECT
    detected_at,
    severity,
    alert_type,
    region_name,
    medicine_name,
    deviation_percent,
    description
FROM v_active_alerts
ORDER BY
    CASE severity
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
    END,
    detected_at DESC;

-- Forecast versus observed demand for medicines by region.
SELECT
    f.forecast_date,
    r.region_name,
    m.generic_name AS medicine_name,
    f.predicted_quantity,
    f.lower_bound,
    f.upper_bound,
    f.confidence_score,
    COALESCE(observed.total_quantity_prescribed, 0) AS observed_quantity
FROM demand_forecasts f
JOIN regions r ON r.region_id = f.region_id
JOIN medications m ON m.medication_id = f.medication_id
LEFT JOIN v_daily_demand observed
    ON observed.region_id = f.region_id
    AND observed.medication_id = f.medication_id
    AND observed.prescription_date = f.forecast_date
ORDER BY f.forecast_date, r.region_name, m.generic_name;
