import { detectSiteCity } from './siteLogo';

export type SiteCity = 'ekb' | 'spb';

export const SITE_CONTACTS = {
  ekb: {
    phone: '8 (908) 916-31-35',
    phoneHref: 'tel:+79089163135',
    email: 'ekat@autobody.ru',
    emailClients: 'd.pankratov@autobody.ru',
    address: 'г. Екатеринбург, ул. Бархотская 2/2',
    yandexRouteHref: 'https://yandex.ru/maps/?rtext=~56.860575,60.666519',
    telegram: '@ekb_autobody',
    telegramHref: 'https://t.me/ekb_autobody',
    hoursWeekdays: 'Пн–Пт: 09:00–18:00',
    hoursSaturday: 'Сб: выходной',
    hoursSunday: 'Вс: выходной',
  },
  spb: {
    phone: '+7 (812) 922-79-79',
    phoneHref: 'tel:+78129227979',
    email: 'spb@autobody.ru',
    emailClients: null as string | null,
    address: 'г. Санкт-Петербург, ул. Смоляная 13к1',
    yandexRouteHref: null as string | null,
    telegram: null as string | null,
    telegramHref: null as string | null,
    hoursWeekdays: 'Пн–Пт: 09:00–18:00',
    hoursSaturday: 'Сб: выходной',
    hoursSunday: 'Вс: выходной',
  },
} as const;

export function getSiteContacts() {
  return SITE_CONTACTS[detectSiteCity()];
}
