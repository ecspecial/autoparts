import logoEkbUrl from '../assets/logo-image.png';
import logoSpbUrl from '../assets/logo-image-spb.jpg';

export function detectSiteCity(): 'ekb' | 'spb' {
  if (typeof window === 'undefined') return 'ekb';
  return window.location.hostname.startsWith('spb.') ? 'spb' : 'ekb';
}

/** Логотип по домену: ekb — PNG, spb — logo-image-spb.jpg */
export function getSiteLogoUrl(): string {
  return detectSiteCity() === 'spb' ? logoSpbUrl : logoEkbUrl;
}
