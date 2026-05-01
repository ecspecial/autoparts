import apiClient from './client';

/** Должна совпадать с DEFAULT_COOKIE_CONSENT_VERSION на сервере. */
export const COOKIE_CONSENT_NOTICE_VERSION = 'cookie-notice-v1-2026-03';

export const COOKIE_CONSENT_STORAGE_NAME = 'ap_cookie_consent';

export async function recordCookieConsent(): Promise<{ consentVersion: string }> {
  const { data } = await apiClient.post<{ ok: boolean; consentVersion: string }>(
    '/consents/cookie',
    { consentVersion: COOKIE_CONSENT_NOTICE_VERSION },
  );
  return { consentVersion: data.consentVersion };
}
