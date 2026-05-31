-- National Pharmaceutical Demand & Prescription Analytics Dashboard
-- PostgreSQL schema for anonymized prescription ingestion, aggregation, forecasting,
-- and public-health anomaly monitoring.

DROP SCHEMA IF EXISTS pharma CASCADE;
CREATE SCHEMA pharma;
SET search_path TO pharma;

CREATE TABLE regions (
    region_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    region_code VARCHAR(20) NOT NULL UNIQUE,
    region_name VARCHAR(120) NOT NULL,
    population INTEGER NOT NULL CHECK (population > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facilities (
    facility_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    region_id BIGINT NOT NULL REFERENCES regions(region_id) ON DELETE RESTRICT,
    facility_code VARCHAR(30) NOT NULL UNIQUE,
    facility_name VARCHAR(160) NOT NULL,
    facility_type VARCHAR(40) NOT NULL CHECK (
        facility_type IN ('hospital', 'clinic', 'pharmacy', 'primary_care', 'specialist_center')
    ),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE providers (
    provider_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    facility_id BIGINT NOT NULL REFERENCES facilities(facility_id) ON DELETE RESTRICT,
    provider_code VARCHAR(40) NOT NULL UNIQUE,
    specialty VARCHAR(80) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medication_classes (
    class_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    atc_code VARCHAR(20) NOT NULL UNIQUE,
    class_name VARCHAR(120) NOT NULL,
    description TEXT
);

CREATE TABLE medications (
    medication_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    class_id BIGINT NOT NULL REFERENCES medication_classes(class_id) ON DELETE RESTRICT,
    medication_code VARCHAR(40) NOT NULL UNIQUE,
    generic_name VARCHAR(160) NOT NULL,
    brand_name VARCHAR(160),
    dosage_form VARCHAR(60) NOT NULL,
    strength VARCHAR(60) NOT NULL,
    unit_of_measure VARCHAR(30) NOT NULL DEFAULT 'unit',
    is_critical BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE anonymized_patients (
    patient_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_hash CHAR(64) NOT NULL UNIQUE,
    age_group VARCHAR(20) NOT NULL CHECK (
        age_group IN ('0-4', '5-17', '18-34', '35-49', '50-64', '65+')
    ),
    sex CHAR(1) NOT NULL CHECK (sex IN ('F', 'M', 'U')),
    home_region_id BIGINT NOT NULL REFERENCES regions(region_id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE import_batches (
    batch_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_system VARCHAR(120) NOT NULL,
    source_file_name VARCHAR(255),
    imported_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    records_received INTEGER NOT NULL DEFAULT 0 CHECK (records_received >= 0),
    records_accepted INTEGER NOT NULL DEFAULT 0 CHECK (records_accepted >= 0),
    records_rejected INTEGER NOT NULL DEFAULT 0 CHECK (records_rejected >= 0),
    status VARCHAR(30) NOT NULL CHECK (
        status IN ('received', 'processing', 'completed', 'completed_with_errors', 'failed')
    ),
    notes TEXT,
    CHECK (records_accepted + records_rejected <= records_received)
);

CREATE TABLE prescriptions (
    prescription_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    external_prescription_ref VARCHAR(80) NOT NULL UNIQUE,
    batch_id BIGINT REFERENCES import_batches(batch_id) ON DELETE SET NULL,
    patient_id BIGINT NOT NULL REFERENCES anonymized_patients(patient_id) ON DELETE RESTRICT,
    provider_id BIGINT NOT NULL REFERENCES providers(provider_id) ON DELETE RESTRICT,
    facility_id BIGINT NOT NULL REFERENCES facilities(facility_id) ON DELETE RESTRICT,
    region_id BIGINT NOT NULL REFERENCES regions(region_id) ON DELETE RESTRICT,
    prescribed_at TIMESTAMPTZ NOT NULL,
    diagnosis_group VARCHAR(120),
    prescription_status VARCHAR(30) NOT NULL DEFAULT 'issued' CHECK (
        prescription_status IN ('issued', 'dispensed', 'partially_dispensed', 'cancelled')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescription_items (
    prescription_item_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    prescription_id BIGINT NOT NULL REFERENCES prescriptions(prescription_id) ON DELETE CASCADE,
    medication_id BIGINT NOT NULL REFERENCES medications(medication_id) ON DELETE RESTRICT,
    quantity_prescribed NUMERIC(12,2) NOT NULL CHECK (quantity_prescribed > 0),
    quantity_dispensed NUMERIC(12,2) CHECK (quantity_dispensed >= 0),
    days_supply INTEGER CHECK (days_supply > 0),
    dosage_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (quantity_dispensed IS NULL OR quantity_dispensed <= quantity_prescribed)
);

CREATE TABLE demand_forecasts (
    forecast_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    medication_id BIGINT NOT NULL REFERENCES medications(medication_id) ON DELETE CASCADE,
    region_id BIGINT NOT NULL REFERENCES regions(region_id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    model_version VARCHAR(60) NOT NULL,
    predicted_quantity NUMERIC(12,2) NOT NULL CHECK (predicted_quantity >= 0),
    lower_bound NUMERIC(12,2) CHECK (lower_bound >= 0),
    upper_bound NUMERIC(12,2) CHECK (upper_bound >= 0),
    confidence_score NUMERIC(5,4) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (medication_id, region_id, forecast_date, model_version),
    CHECK (lower_bound IS NULL OR upper_bound IS NULL OR lower_bound <= upper_bound)
);

CREATE TABLE anomaly_alerts (
    alert_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    medication_id BIGINT NOT NULL REFERENCES medications(medication_id) ON DELETE CASCADE,
    region_id BIGINT NOT NULL REFERENCES regions(region_id) ON DELETE CASCADE,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    alert_type VARCHAR(40) NOT NULL CHECK (
        alert_type IN ('demand_spike', 'shortage_risk', 'unusual_region_pattern', 'data_quality')
    ),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    observed_quantity NUMERIC(12,2) CHECK (observed_quantity >= 0),
    expected_quantity NUMERIC(12,2) CHECK (expected_quantity >= 0),
    deviation_percent NUMERIC(8,2),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (
        status IN ('open', 'investigating', 'resolved', 'dismissed')
    ),
    description TEXT NOT NULL,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE audit_log (
    audit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor VARCHAR(120) NOT NULL,
    action VARCHAR(80) NOT NULL,
    entity_name VARCHAR(80) NOT NULL,
    entity_id BIGINT,
    action_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    details JSONB
);

CREATE INDEX idx_facilities_region ON facilities(region_id);
CREATE INDEX idx_providers_facility ON providers(facility_id);
CREATE INDEX idx_medications_class ON medications(class_id);
CREATE INDEX idx_patients_home_region ON anonymized_patients(home_region_id);
CREATE INDEX idx_prescriptions_prescribed_at ON prescriptions(prescribed_at);
CREATE INDEX idx_prescriptions_region_date ON prescriptions(region_id, prescribed_at);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX idx_prescription_items_medication ON prescription_items(medication_id);
CREATE INDEX idx_forecasts_region_med_date ON demand_forecasts(region_id, medication_id, forecast_date);
CREATE INDEX idx_alerts_status_severity ON anomaly_alerts(status, severity, detected_at DESC);

CREATE VIEW v_daily_demand AS
SELECT
    CAST(p.prescribed_at AS DATE) AS prescription_date,
    r.region_id,
    r.region_name,
    mc.atc_code,
    mc.class_name,
    m.medication_id,
    m.generic_name AS medicine_name,
    COUNT(DISTINCT p.prescription_id) AS prescription_count,
    SUM(pi.quantity_prescribed) AS total_quantity_prescribed,
    SUM(COALESCE(pi.quantity_dispensed, 0)) AS total_quantity_dispensed
FROM prescriptions p
JOIN prescription_items pi ON pi.prescription_id = p.prescription_id
JOIN medications m ON m.medication_id = pi.medication_id
JOIN medication_classes mc ON mc.class_id = m.class_id
JOIN regions r ON r.region_id = p.region_id
WHERE p.prescription_status <> 'cancelled'
GROUP BY
    CAST(p.prescribed_at AS DATE),
    r.region_id,
    r.region_name,
    mc.atc_code,
    mc.class_name,
    m.medication_id,
    m.generic_name;

CREATE VIEW v_regional_demand_summary AS
SELECT
    r.region_id,
    r.region_name,
    r.population,
    COUNT(DISTINCT p.prescription_id) AS prescription_count,
    SUM(pi.quantity_prescribed) AS total_quantity_prescribed,
    ROUND((COUNT(DISTINCT p.prescription_id)::NUMERIC / r.population) * 100000, 2)
        AS prescriptions_per_100k
FROM regions r
LEFT JOIN prescriptions p ON p.region_id = r.region_id AND p.prescription_status <> 'cancelled'
LEFT JOIN prescription_items pi ON pi.prescription_id = p.prescription_id
GROUP BY r.region_id, r.region_name, r.population;

CREATE VIEW v_medication_demand_summary AS
SELECT
    m.medication_id,
    m.generic_name,
    m.brand_name,
    mc.class_name,
    m.is_critical,
    COUNT(DISTINCT p.prescription_id) AS prescription_count,
    SUM(pi.quantity_prescribed) AS total_quantity_prescribed,
    MAX(p.prescribed_at) AS latest_prescription_at
FROM medications m
JOIN medication_classes mc ON mc.class_id = m.class_id
LEFT JOIN prescription_items pi ON pi.medication_id = m.medication_id
LEFT JOIN prescriptions p ON p.prescription_id = pi.prescription_id
    AND p.prescription_status <> 'cancelled'
GROUP BY m.medication_id, m.generic_name, m.brand_name, mc.class_name, m.is_critical;

CREATE VIEW v_active_alerts AS
SELECT
    a.alert_id,
    a.detected_at,
    a.alert_type,
    a.severity,
    a.status,
    r.region_name,
    m.generic_name AS medicine_name,
    a.observed_quantity,
    a.expected_quantity,
    a.deviation_percent,
    a.description
FROM anomaly_alerts a
JOIN regions r ON r.region_id = a.region_id
JOIN medications m ON m.medication_id = a.medication_id
WHERE a.status IN ('open', 'investigating');
