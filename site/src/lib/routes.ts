/** Site map — mirrors the sections of the source site as separate pages; the home page stays the magazine. */
export const pages = [
  { path: '/', label: 'ГЛАВНАЯ', title: 'От идеи до кадра' },
  { path: '/portfolio', label: 'ПОРТФОЛИО', title: 'Портфолио' },
  { path: '/uslugi', label: 'УСЛУГИ', title: 'Услуги' },
  { path: '/tarify', label: 'ТАРИФЫ', title: 'Тарифы' },
  { path: '/komanda', label: 'КОМАНДА', title: 'Команда' },
  { path: '/otzyvy', label: 'ОТЗЫВЫ', title: 'Отзывы' },
  { path: '/brif', label: 'БРИФ', title: 'Бриф' },
  { path: '/kontakty', label: 'КОНТАКТЫ', title: 'Контакты' },
] as const;

export type PagePath = (typeof pages)[number]['path'];

/** Where an in-page anchor leads when its section is not on the current page. */
export const anchorRoutes: Record<string, string> = {
  'sp-02': '/portfolio',
  'sp-04': '/uslugi',
  'sp-06': '/tarify',
  'sp-07': '/komanda',
  'sp-08': '/otzyvy',
  'sp-09': '/brif',
  'sp-12': '/kontakty',
};

export const pageTitle = (path: string) => {
  const p = pages.find((x) => x.path === path);
  return p && p.path !== '/' ? `${p.title} — Видеопродакшн.РФ` : 'Видеопродакшн.РФ — От идеи до кадра';
};
