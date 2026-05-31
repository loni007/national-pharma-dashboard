SET search_path TO pharma;

INSERT INTO regions (region_code, region_name, population) VALUES
    ('SK', 'Skopje Region', 607007),
    ('PO', 'Polog Region', 317000),
    ('EA', 'Eastern Region', 176000),
    ('SW', 'Southwestern Region', 219000),
    ('VA', 'Vardar Region', 152000);

INSERT INTO facilities (region_id, facility_code, facility_name, facility_type) VALUES
    ((SELECT region_id FROM regions WHERE region_code = 'SK'), 'FAC-SK-001', 'Skopje University Clinic', 'hospital'),
    ((SELECT region_id FROM regions WHERE region_code = 'SK'), 'FAC-SK-002', 'Centar Primary Care', 'primary_care'),
    ((SELECT region_id FROM regions WHERE region_code = 'PO'), 'FAC-PO-001', 'Tetovo Clinical Hospital', 'hospital'),
    ((SELECT region_id FROM regions WHERE region_code = 'EA'), 'FAC-EA-001', 'Shtip General Hospital', 'hospital'),
    ((SELECT region_id FROM regions WHERE region_code = 'SW'), 'FAC-SW-001', 'Ohrid Regional Pharmacy', 'pharmacy'),
    ((SELECT region_id FROM regions WHERE region_code = 'VA'), 'FAC-VA-001', 'Veles Primary Care', 'primary_care');

INSERT INTO providers (facility_id, provider_code, specialty) VALUES
    ((SELECT facility_id FROM facilities WHERE facility_code = 'FAC-SK-001'), 'PRV-SK-001', 'infectious_disease'),
    ((SELECT facility_id FROM facilities WHERE facility_code = 'FAC-SK-002'), 'PRV-SK-002', 'family_medicine'),
    ((SELECT facility_id FROM facilities WHERE facility_code = 'FAC-PO-001'), 'PRV-PO-001', 'pulmonology'),
    ((SELECT facility_id FROM facilities WHERE facility_code = 'FAC-EA-001'), 'PRV-EA-001', 'internal_medicine'),
    ((SELECT facility_id FROM facilities WHERE facility_code = 'FAC-SW-001'), 'PRV-SW-001', 'pharmacy'),
    ((SELECT facility_id FROM facilities WHERE facility_code = 'FAC-VA-001'), 'PRV-VA-001', 'family_medicine');

INSERT INTO medication_classes (atc_code, class_name, description) VALUES
    ('J01', 'Antibacterials for systemic use', 'Antibiotics used to treat bacterial infections.'),
    ('R03', 'Drugs for obstructive airway diseases', 'Respiratory medicines including inhalers.'),
    ('N02', 'Analgesics', 'Pain relief and fever management medicines.'),
    ('A10', 'Drugs used in diabetes', 'Insulin and oral glucose-lowering therapies.'),
    ('C09', 'Agents acting on the renin-angiotensin system', 'Common cardiovascular medicines.');

INSERT INTO medications (
    class_id,
    medication_code,
    generic_name,
    brand_name,
    dosage_form,
    strength,
    unit_of_measure,
    is_critical
) VALUES
    ((SELECT class_id FROM medication_classes WHERE atc_code = 'J01'), 'MED-AMOX-500', 'Amoxicillin', 'Amoxil', 'capsule', '500 mg', 'capsule', FALSE),
    ((SELECT class_id FROM medication_classes WHERE atc_code = 'R03'), 'MED-SALB-100', 'Salbutamol', 'Ventolin', 'inhaler', '100 mcg/dose', 'dose', TRUE),
    ((SELECT class_id FROM medication_classes WHERE atc_code = 'N02'), 'MED-PARA-500', 'Paracetamol', 'Panadol', 'tablet', '500 mg', 'tablet', FALSE),
    ((SELECT class_id FROM medication_classes WHERE atc_code = 'A10'), 'MED-METF-850', 'Metformin', 'Glucophage', 'tablet', '850 mg', 'tablet', TRUE),
    ((SELECT class_id FROM medication_classes WHERE atc_code = 'C09'), 'MED-LISI-10', 'Lisinopril', 'Zestril', 'tablet', '10 mg', 'tablet', TRUE);

INSERT INTO anonymized_patients (patient_hash, age_group, sex, home_region_id) VALUES
    ('0f4d5b8d6e62b89c28ddf192f8ed2aa9c1793bd6b5c9547bda36bba742f9f001', '18-34', 'F', (SELECT region_id FROM regions WHERE region_code = 'SK')),
    ('1a3d9d3f8f2a9289180f4b7a72949a7c01be548d8e0288aa5a8adbc6ad0f0002', '35-49', 'M', (SELECT region_id FROM regions WHERE region_code = 'PO')),
    ('2b6cfe8d7a60c1e12285f8f09853d071a13f15c2320b333da489edacf9040003', '65+', 'F', (SELECT region_id FROM regions WHERE region_code = 'EA')),
    ('3ce70b7a5b70e92a0bcf5738f52d41de03f65a9b64cd2fdb92015124a0a40004', '50-64', 'M', (SELECT region_id FROM regions WHERE region_code = 'SW')),
    ('4df81e6e17e2a0b48f9ad1d205f2cf93dcabf3304df0c0fd427b350660e50005', '5-17', 'U', (SELECT region_id FROM regions WHERE region_code = 'VA'));

INSERT INTO import_batches (
    source_system,
    source_file_name,
    records_received,
    records_accepted,
    records_rejected,
    status,
    notes
) VALUES
    ('Ministry of Health ePrescription', 'moh_eprescriptions_2026_05_sample.csv', 8, 8, 0, 'completed', 'Sample anonymized ingestion batch for dashboard development.');

INSERT INTO prescriptions (
    external_prescription_ref,
    batch_id,
    patient_id,
    provider_id,
    facility_id,
    region_id,
    prescribed_at,
    diagnosis_group,
    prescription_status
) VALUES
    ('RX-2026-0001', 1, 1, 1, 1, (SELECT region_id FROM regions WHERE region_code = 'SK'), '2026-05-24 09:15:00+02', 'respiratory infection', 'dispensed'),
    ('RX-2026-0002', 1, 2, 3, 3, (SELECT region_id FROM regions WHERE region_code = 'PO'), '2026-05-24 10:40:00+02', 'asthma exacerbation', 'dispensed'),
    ('RX-2026-0003', 1, 3, 4, 4, (SELECT region_id FROM regions WHERE region_code = 'EA'), '2026-05-25 13:20:00+02', 'diabetes maintenance', 'dispensed'),
    ('RX-2026-0004', 1, 4, 5, 5, (SELECT region_id FROM regions WHERE region_code = 'SW'), '2026-05-25 14:05:00+02', 'hypertension maintenance', 'partially_dispensed'),
    ('RX-2026-0005', 1, 5, 6, 6, (SELECT region_id FROM regions WHERE region_code = 'VA'), '2026-05-26 08:55:00+02', 'fever', 'dispensed'),
    ('RX-2026-0006', 1, 1, 2, 2, (SELECT region_id FROM regions WHERE region_code = 'SK'), '2026-05-26 16:30:00+02', 'respiratory infection', 'dispensed'),
    ('RX-2026-0007', 1, 2, 3, 3, (SELECT region_id FROM regions WHERE region_code = 'PO'), '2026-05-27 11:10:00+02', 'respiratory infection', 'issued'),
    ('RX-2026-0008', 1, 3, 4, 4, (SELECT region_id FROM regions WHERE region_code = 'EA'), '2026-05-27 12:45:00+02', 'hypertension maintenance', 'dispensed');

INSERT INTO prescription_items (
    prescription_id,
    medication_id,
    quantity_prescribed,
    quantity_dispensed,
    days_supply,
    dosage_instructions
) VALUES
    ((SELECT prescription_id FROM prescriptions WHERE external_prescription_ref = 'RX-2026-0001'), (SELECT medication_id FROM medications WHERE medication_code = 'MED-AMOX-500'), 21, 21, 7, 'One capsule three times daily.'),
    ((SELECT prescription_id FROM prescriptions WHERE external_prescription_ref = 'RX-2026-0001'), (SELECT medication_id FROM medications WHERE medication_code = 'MED-PARA-500'), 20, 20, 5, 'One tablet as needed for fever.'),
    ((SELECT prescription_id FROM prescriptions WHERE external_prescription_ref = 'RX-2026-0002'), (SELECT medication_id FROM medications WHERE medication_code = 'MED-SALB-100'), 200, 200, 30, 'Two inhalations as needed.'),
    ((SELECT prescription_id FROM prescriptions WHERE external_prescription_ref = 'RX-2026-0003'), (SELECT medication_id FROM medications WHERE medication_code = 'MED-METF-850'), 60, 60, 30, 'One tablet twice daily.'),
    ((SELECT prescription_id FROM prescriptions WHERE external_prescription_ref = 'RX-2026-0004'), (SELECT medication_id FROM medications WHERE medication_code = 'MED-LISI-10'), 30, 20, 30, 'One tablet daily.'),
    ((SELECT prescription_id FROM prescriptions WHERE external_prescription_ref = 'RX-2026-0005'), (SELECT medication_id FROM medications WHERE medication_code = 'MED-PARA-500'), 16, 16, 4, 'One tablet every six hours if needed.'),
    ((SELECT prescription_id FROM prescriptions WHERE external_prescription_ref = 'RX-2026-0006'), (SELECT medication_id FROM medications WHERE medication_code = 'MED-AMOX-500'), 21, 21, 7, 'One capsule three times daily.'),
    ((SELECT prescription_id FROM prescriptions WHERE external_prescription_ref = 'RX-2026-0007'), (SELECT medication_id FROM medications WHERE medication_code = 'MED-SALB-100'), 200, NULL, 30, 'Two inhalations as needed.'),
    ((SELECT prescription_id FROM prescriptions WHERE external_prescription_ref = 'RX-2026-0008'), (SELECT medication_id FROM medications WHERE medication_code = 'MED-LISI-10'), 30, 30, 30, 'One tablet daily.');

INSERT INTO demand_forecasts (
    medication_id,
    region_id,
    forecast_date,
    model_version,
    predicted_quantity,
    lower_bound,
    upper_bound,
    confidence_score
) VALUES
    ((SELECT medication_id FROM medications WHERE medication_code = 'MED-AMOX-500'), (SELECT region_id FROM regions WHERE region_code = 'SK'), '2026-06-01', 'baseline-arima-v1', 45, 32, 61, 0.8200),
    ((SELECT medication_id FROM medications WHERE medication_code = 'MED-SALB-100'), (SELECT region_id FROM regions WHERE region_code = 'PO'), '2026-06-01', 'baseline-arima-v1', 260, 190, 340, 0.7600),
    ((SELECT medication_id FROM medications WHERE medication_code = 'MED-METF-850'), (SELECT region_id FROM regions WHERE region_code = 'EA'), '2026-06-01', 'baseline-arima-v1', 58, 50, 72, 0.8800),
    ((SELECT medication_id FROM medications WHERE medication_code = 'MED-LISI-10'), (SELECT region_id FROM regions WHERE region_code = 'SW'), '2026-06-01', 'baseline-arima-v1', 42, 30, 54, 0.7900);

INSERT INTO anomaly_alerts (
    medication_id,
    region_id,
    alert_type,
    severity,
    observed_quantity,
    expected_quantity,
    deviation_percent,
    status,
    description
) VALUES
    ((SELECT medication_id FROM medications WHERE medication_code = 'MED-SALB-100'), (SELECT region_id FROM regions WHERE region_code = 'PO'), 'demand_spike', 'high', 200, 115, 73.91, 'open', 'Salbutamol prescriptions are above the expected range for Polog Region.'),
    ((SELECT medication_id FROM medications WHERE medication_code = 'MED-LISI-10'), (SELECT region_id FROM regions WHERE region_code = 'SW'), 'shortage_risk', 'medium', 30, 45, -33.33, 'investigating', 'Partial dispensing suggests possible supply pressure for Lisinopril.');

INSERT INTO audit_log (actor, action, entity_name, entity_id, details) VALUES
    ('system', 'import_completed', 'import_batches', 1, '{"accepted": 8, "rejected": 0}'::jsonb),
    ('analytics-service', 'forecast_generated', 'demand_forecasts', NULL, '{"model_version": "baseline-arima-v1"}'::jsonb),
    ('analytics-service', 'alert_created', 'anomaly_alerts', 1, '{"reason": "demand above expected threshold"}'::jsonb);
