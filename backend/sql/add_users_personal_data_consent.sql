-- Production (synchronize выключен): когда данные впервые сохраняются через ЛК после обновления, при необходимости отмечайте факт из UI.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS personal_data_processing_consent_at TIMESTAMPTZ;
