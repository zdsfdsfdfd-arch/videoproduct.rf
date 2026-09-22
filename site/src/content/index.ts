// All real content from the source site (видеопродакшн.рф), as verified in the design handoff.
// Nothing here is invented: numbers, prices, names and roles come from the source or content.json.
import { backgrounds, clients, posters, process, team, type Photo } from '@/assets';

export const VK_OWNER = '-162568874';
export const vkVideoUrl = (id: string) => `https://vkvideo.ru/video${VK_OWNER}_${id}`;
export const vkEmbedUrl = (id: string, params = '') =>
  `https://vkvideo.ru/video_ext.php?oid=${VK_OWNER}&id=${id}&hd=2${params}`;

export const contacts = {
  brand: 'ВИДЕОПРОДАКШН.РФ',
  phoneDisplay: '8 905 377 12 78',
  phoneHref: 'tel:89053771278',
  email: 'mail@видеопродакшн.рф',
  emailHref: 'mailto:mail@xn--80adgaeqsyfakm2i.xn--p1ai',
  whatsapp: 'https://wa.me/79053771278',
  /** Not published on the source site — rendered as a dashed placeholder until provided. */
  telegram: null as string | null,
  /** Not published on the source site. */
  privacyPolicy: null as string | null,
  since: 2015,
};

export const cities = ['МОСКВА', 'КАЗАНЬ', 'САНКТ-ПЕТЕРБУРГ'] as const;

export const facts = [
  { label: 'ВИДЕОРОЛИКОВ', value: '2500+' },
  { label: 'ГОРОДОВ СЪЁМОК', value: '25' },
  { label: 'КЛИЕНТОВ', value: '600+' },
  { label: 'СПЕЦИАЛИСТОВ', value: '15' },
  { label: 'ЧАСОВ ОПЫТА', value: '45 000+' },
  { label: 'СВОЁ ОБОРУДОВАНИЕ', value: '5 000 000 ₽', accent: true },
] as const;

export const navItems = [
  { id: 'sp-00', label: '00 ОБЛОЖКА' },
  { id: 'sp-01', label: '01 НАЧАЛО' },
  { id: 'sp-02', label: '02 РАБОТЫ' },
  { id: 'sp-03', label: '03 ПРОЦЕСС' },
  { id: 'sp-04', label: '04 УСЛУГИ' },
  { id: 'sp-05', label: '05 ЗА КАДРОМ' },
  { id: 'sp-06', label: '06 ТАРИФЫ' },
  { id: 'sp-07', label: '07 КОМАНДА' },
  { id: 'sp-08', label: '08 ОТЗЫВЫ' },
  { id: 'sp-09', label: '09 БРИФ' },
  { id: 'sp-10', label: '10 ГЕОГРАФИЯ' },
  { id: 'sp-11', label: '11 ВОПРОСЫ' },
  { id: 'sp-12', label: '12 КОНТАКТ' },
] as const;

/**
 * Chapters the phone does without. «За кадром» is a full-height frame with a word set over it —
 * on a phone it is a screen of photograph you scroll past, so the studio asked for it to go.
 * The section is not rendered there at all, so its images are never fetched, and the index drops
 * the entry with it.
 */
export const phoneHiddenSections: readonly string[] = ['sp-05'];

/**
 * Client marks. The cutouts are monochrome, so each carries its brand fill (a gradient where the
 * mark is multi-coloured: Avito's four dots, the Yandex «@», МЕГА's letters). `ratio` is the
 * cutout's width/height — needed because a CSS mask has no intrinsic size.
 */
export const clientLogos = [
  { name: 'ICL Services', src: clients.icl, h: 'clamp(58px, 5.6vw, 106px)', ratio: '240 / 190', fill: '#2F80ED', glow: '#2F80ED' },
  { name: 'Leroy Merlin', src: clients.leroy, h: 'clamp(52px, 5vw, 97px)', ratio: '240 / 160', fill: '#78BE20', glow: '#78BE20' },
  { name: 'Avito', src: clients.avito, h: 'clamp(38px, 3.5vw, 66px)', ratio: '320 / 130', fill: 'linear-gradient(to right, transparent 0 27%, #F1EDF7 27%), conic-gradient(from 0deg at 13.5% 50%, #FF4053 0 25%, #965EEB 25% 50%, #0AF 50% 75%, #04E061 75%)', glow: '#965EEB' },
  { name: 'Унистрой', src: clients.unistroy, h: 'clamp(58px, 5.6vw, 106px)', ratio: '200 / 180', fill: '#E8B84A', glow: '#E8B84A' },
  { name: 'Автодор', src: clients.avtodor, h: 'clamp(34px, 3.2vw, 62px)', ratio: '380 / 120', fill: 'linear-gradient(to right, #1FA2FF 0 22%, #F1EDF7 22%)', glow: '#1FA2FF' },
  { name: 'VK', src: clients.vk, h: 'clamp(44px, 4.1vw, 79px)', ratio: '140 / 140', fill: '#0077FF', glow: '#0077FF' },
  { name: 'Яндекс Еда', src: clients.yandexEda, h: 'clamp(32px, 3vw, 57px)', ratio: '370 / 100', fill: 'linear-gradient(to right, #F1EDF7 0 50%, #FFCC00 50% 64%, #F1EDF7 64%)', glow: '#FFCC00' },
  { name: 'МЕГА', src: clients.mega, h: 'clamp(42px, 3.9vw, 75px)', ratio: '350 / 140', fill: 'linear-gradient(to right, #0058A3 0 30%, #E3000F 30% 52%, #00A651 52% 73%, #FFDA00 73%)', glow: '#E3000F' },
  { name: 'СИБУР', src: clients.sibur, h: 'clamp(32px, 3.1vw, 57px)', ratio: '360 / 110', fill: '#00A651', glow: '#00A651' },
];

export interface Work {
  id: string;
  title: string;
  type: string;
  poster?: string;
  accent?: boolean;
  /** Archive entry: the video is the studio's, but its title is described from the frame and awaits the studio's wording. */
  archive?: boolean;
}

/** Portfolio — VK id ↔ project pairs confirmed by the client on 17.09.2026. */
export const works: Work[] = [
  { id: '456239162', title: 'Рекламный ролик ЖК «Art City»', type: 'РЕКЛАМА', poster: posters['456239162'] },
  { id: '456239545', title: 'Рекламный ролик «Apple» для кинотеатров', type: 'РЕКЛАМА', poster: posters['456239545'] },
  { id: '456239539', title: 'Рекламный видеоролик для маркетплейсов', type: 'МАРКЕТПЛЕЙСЫ', poster: posters['456239539'] },
  { id: '456239459', title: 'Рекламный ролик для компании по производству авиационных интерьеров', type: 'ПРОИЗВОДСТВО', poster: posters['456239459'] },
  { id: '456239356', title: '3D-мультипликация об 1C для компании «ICL»', type: '3D-АНИМАЦИЯ', poster: posters['456239356'], accent: true },
  { id: '456239359', title: 'Имиджевый ролик о компании «Технодор СК»', type: 'ИМИДЖ', poster: posters['456239359'] },
  { id: '456239518', title: 'Документальный фильм о В.Б. Шнеппе для НИИ «Турбокомпрессор»', type: 'ДОКУМЕНТАЛЬНЫЙ ФИЛЬМ', poster: posters['456239518'] },
  // No still frame was supplied for the university film — the VK preview loads straight away for it.
  { id: '456239540', title: 'Презентационный фильм о Южно-Российском государственном политехническом университете', type: 'ПРЕЗЕНТАЦИЯ' },
  { id: '456239538', title: 'Рекламное видео для компании «Cattoi»', type: 'РЕКЛАМА', poster: posters['456239538'] },
];

/**
 * Archive — nine more videos from the studio's VK channel (community −162568874) that came with the export
 * but without titles or clients. Titles below describe what is in the frame; they are shown with an
 * «архив» mark and must be replaced with the studio's own wording. TODO(studio): confirm titles/clients.
 */
export const archiveWorks: Work[] = [
  { id: '456239369', title: 'Фильм о строительстве моста через Осипов овраг', type: 'ПРЕЗЕНТАЦИЯ', poster: posters['456239369'], archive: true },
  { id: '456239388', title: 'Видео о продукции: коробка УТН-4 для подключения тензодатчиков', type: 'ВИДЕО О ПРОДУКЦИИ', poster: posters['456239388'], archive: true },
  { id: '456239521', title: 'Репортаж с производства «Wagenmaier»', type: 'РЕПОРТАЖ', poster: posters['456239521'], archive: true },
  { id: '456239161', title: 'Презентационный ролик о добыче песка: земснаряд и баржи', type: 'ПРЕЗЕНТАЦИЯ', poster: posters['456239161'], archive: true },
  { id: '456239519', title: 'Имиджевый ролик автомобиля: ночная городская съёмка', type: 'РЕКЛАМА', poster: posters['456239519'], archive: true },
  { id: '456239159', title: 'Репортаж с выставочного стенда', type: 'РЕПОРТАЖ', poster: posters['456239159'], archive: true },
  { id: '456239447', title: 'Интервью с командой IT-компании', type: 'ИНТЕРВЬЮ', poster: posters['456239447'], accent: true, archive: true },
  { id: '456239354', title: 'Съёмка трактора «Stavitsky161» в поле', type: 'РЕПОРТАЖ', poster: posters['456239354'], archive: true },
  { id: '456239353', title: 'Подкаст: запись интервью в студии', type: 'ПОДКАСТ', poster: posters['456239353'], archive: true },
];

/** Every openable case: confirmed works first, then the archive. Case indices are positions in this list. */
export const allWorks: Work[] = [...works, ...archiveWorks];

export const heroVideoId = '456239162';

export interface ProcessStep {
  title: string;
  description: string;
  tariffs: string;
  frame: { photo: Photo; alt: string };
}

export const processSteps: ProcessStep[] = [
  { title: 'Сценарий', description: 'Сценарист, режиссёр и продюсер собирают идею в историю. Каждая сцена расписана до реплики.', tariffs: 'СТАРТ (БАЗОВЫЙ) · СТАНДАРТ · КОМБО', frame: { photo: process.studioSet, alt: 'Сценарий: обсуждение на площадке' } },
  { title: 'Раскадровка', description: 'Режиссёр рисует кадры и планы. Заказчик видит будущий ролик до съёмочного дня.', tariffs: 'СТАНДАРТ · КОМБО', frame: { photo: process.boardroomSlider, alt: 'Обсуждение раскадровки в переговорной' } },
  { title: 'Видеосъёмка', description: 'Своё оборудование на 5 000 000 ₽, команда до 15 человек, съёмки в 25 городах.', tariffs: 'СТАРТ · СТАНДАРТ · КОМБО', frame: { photo: process.factoryBoom, alt: 'Съёмка: завод, журавль, петличка' } },
  { title: 'Видеомонтаж', description: 'Ритм, темп и драматургия собираются из отснятого материала.', tariffs: 'СТАРТ · СТАНДАРТ · КОМБО', frame: { photo: process.loftInterview, alt: 'Отснятый материал на мониторах в студии' } },
  { title: 'Цветокоррекция', description: 'Кадры приводятся к единому кинематографичному изображению.', tariffs: 'СТАНДАРТ · КОМБО', frame: { photo: process.podcastStudio, alt: 'Цветокоррекция: свет и цвет' } },
  { title: 'Саунд-дизайн', description: 'Чистый диалог, музыка, шумы и эффекты — звук делает половину впечатления.', tariffs: 'СТАНДАРТ · КОМБО', frame: { photo: process.studioCrane, alt: 'Запись на площадке: журавль и микрофон' } },
  { title: 'Графика', description: 'Инфографика, 2D/3D-анимация и логотипы завершают ролик.', tariffs: 'СТАНДАРТ · КОМБО', frame: { photo: { src: posters['456239356'], small: posters['456239356'], width: 1280 }, alt: 'Графика: моушен-дизайн и 3D-анимация' } },
];

export interface ServiceChapter {
  title: string;
  side: 'left' | 'right';
  items: string[];
  /** One of the palette hues (global.css) — the chapter's colour on the page. */
  hue: 'violet' | 'indigo' | 'orchid' | 'soft';
  /** A still from the studio's own shoots, so the list is not five identical blocks of text. */
  photo: Photo;
  photoAlt: string;
}

export const serviceChapters: ServiceChapter[] = [
  { title: 'Реклама и продажи', side: 'left', items: ['Рекламный видеоролик', 'Информационный ролик', 'Видео для маркетплейсов', 'Видео для соцсетей', 'Видеоролики для B2B', 'Видеоролик для выставок'], hue: 'indigo', photo: process.studioSet, photoAlt: 'Съёмочная площадка в студии' },
  { title: 'Имидж и компания', side: 'right', items: ['Имиджевый ролик', 'Презентационное видео', 'Корпоративные ролики', 'Видеообращение от CEO', 'HR-видео', 'Создание фильма на юбилей компании', 'Документальный фильм'], hue: 'violet', photo: process.boardroomSlider, photoAlt: 'Съёмка в переговорной со слайдером' },
  { title: 'Производство и объекты', side: 'left', items: ['Производственные видео', 'Видеосъёмка недвижимости', 'Предметная съёмка', 'Аэросъёмка с дроном', 'Отчётные ролики'], hue: 'soft', photo: process.factoryJib, photoAlt: 'Съёмка на производстве с крана' },
  { title: 'События и эфир', side: 'right', items: ['Видеосъёмка мероприятий', 'Видеосъёмка форумов', 'Съёмка интервью и подкастов', 'Видеосъёмка для YouTube', 'Запись вебинаров'], hue: 'orchid', photo: process.podcastStudio, photoAlt: 'Подкаст-студия во время записи' },
  { title: 'Обучение и постпродакшн', side: 'left', items: ['Обучающие видео и видеокурсы', 'Видеоинструкции для бизнеса', 'Монтаж видеороликов', '2D-анимация'], hue: 'indigo', photo: process.loftInterview, photoAlt: 'Интервью в лофте, свет и камера' },
];

export const servicesTotal = serviceChapters.reduce((n, c) => n + c.items.length, 0);

export const backstage = {
  layers: [process.factoryBoom, process.studioCrane, process.loftInterview],
  words: ['Мотор', 'Камера', 'Свет', 'Команда', 'Кадр', 'Снято'],
  strip: [process.podcastStudio, process.boardroomSlider, process.studioCrane, process.loftInterview, process.factoryJib, process.studioSet],
};

export interface Tariff {
  index: string;
  name: string;
  price: string;
  stages: string[];
  description: string;
  fits: string;
  /** Size of the crew on this plan. From the studio's own tariff table. */
  team: string;
  /** How many shooting days the plan covers. From the studio's own tariff table. */
  shoots: string;
  /** Typical time from brief to delivery. From the studio's own tariff table. */
  term: string;
  /** The plan the studio marks as its «хит» — the middle one. */
  accent?: boolean;
  /** Each card takes its own step along the violet family, so three plans are not one wall. */
  hue: 'indigo' | 'violet' | 'orchid';
}

export const tariffs: Tariff[] = [
  { index: 'ТАРИФ 01', name: 'СТАРТ', price: 'от 90 000 ₽', stages: ['Базовый сценарий', 'Видеосъёмка', 'Видеомонтаж'], description: 'Минимальный препродакшн и небольшая команда. Такие проекты выполняем быстро и в большом количестве.', fits: 'Маркетплейсы · Видеокурсы · Интервью и подкасты · YouTube и соцсети · Сопровождение мероприятий', team: 'Команда до 5 специалистов', shoots: '1 съёмочная смена', term: 'Средний срок — 2 недели', hue: 'indigo' },
  { index: 'ТАРИФ 02', name: 'СТАНДАРТ', price: 'от 350 000 ₽', stages: ['Сценарий', 'Раскадровка', 'Видеосъёмка', 'Видеомонтаж', 'Цветокоррекция', 'Саунд-дизайн', 'Графика'], description: 'Заложены все необходимые этапы и специалисты, которые могут потребоваться для наилучшего результата.', fits: 'Корпоративные ролики · Презентация компании · Реклама · HR-видео', team: 'Команда от 5 специалистов', shoots: 'От 2 съёмочных смен', term: 'Средний срок — 1 месяц', accent: true, hue: 'violet' },
  { index: 'ТАРИФ 03', name: 'КОМБО', price: 'от 750 000 ₽', stages: ['Сценарий', 'Раскадровка', 'Видеосъёмка', 'Видеомонтаж', 'Цветокоррекция', 'Саунд-дизайн', 'Графика'], description: 'Самый насыщенный тариф. Минимум компромиссов — максимум качества.', fits: 'Имиджевые и документальные фильмы · Широкая география и командировки · Много специалистов · Срочные заказы', team: 'Вся продакшн-команда', shoots: 'От 3 до 10 съёмочных смен', term: 'Средний срок — 1–2 месяца', hue: 'orchid' },
];

export interface Person {
  name: string;
  role: string;
  src: string;
  /** Stage placement, % of the stage: left, height; z-layer; caption height. */
  left: number;
  height: number;
  z: number;
  captionBottom: number;
  /** Horizontal mouse-parallax factor in px. */
  mx: number;
  /** Scroll-reveal lift in px. */
  lift: number;
  accent?: boolean;
  /** Hover effect: the big word, its colour, the technical plate line. */
  fx: { word: string; color: string; meta: string };
}

export const people: Person[] = [
  { name: 'Булат', role: 'ХУДОЖНИК ПО СВЕТУ', src: team.bulat, left: 2, height: 66, z: 1, captionBottom: 28, mx: -14, lift: 60, fx: { word: 'Свет', color: '#CBB3FF', meta: 'КРАСНЫЙ ФИЛЬТР · 3200K' } },
  { name: 'Алексей', role: 'ПИЛОТ КВАДРОКОПТЕРА', src: team.aleksey, left: 11.5, height: 92, z: 2, captionBottom: 38, mx: 0, lift: 70, fx: { word: 'Дрон', color: '#7A6BFF', meta: 'ALT 42 m · GPS 14 · REC' } },
  { name: 'Николай', role: 'ВИДЕООПЕРАТОР', src: team.nikolay, left: 23.5, height: 78, z: 1, captionBottom: 28, mx: -14, lift: 80, fx: { word: 'Камера', color: '#9B7CFF', meta: '4K · 50p · STAB ON' } },
  { name: 'Семён', role: 'КИНООПЕРАТОР', src: team.semen, left: 35, height: 100, z: 3, captionBottom: 38, mx: 14, lift: 90, fx: { word: 'Кино', color: '#A489FF', meta: '24 FPS · 2.39:1 · ISO 800' } },
  { name: 'Роман', role: 'РЕЖИССЁР', src: team.roman, left: 47, height: 86, z: 2, captionBottom: 28, mx: 0, lift: 100, accent: true, fx: { word: 'Мотор!', color: '#B48CFF', meta: 'SCENE 04 · TAKE 01 · ACTION' } },
  { name: 'Аниса', role: 'ГРИМЁР', src: team.anisa, left: 58.5, height: 96, z: 3, captionBottom: 38, mx: 14, lift: 110, fx: { word: 'Грим', color: '#D48BFF', meta: 'SOFT LIGHT · 5600K' } },
  { name: 'Исхак', role: 'ЗВУКОРЕЖИССЁР', src: team.iskhak, left: 70, height: 80, z: 1, captionBottom: 28, mx: -14, lift: 120, fx: { word: 'Звук', color: '#6E4CD8', meta: '48 kHz · 24 bit · -12 dB' } },
  { name: 'Ирина', role: 'РЕЖИССЁР МОНТАЖА', src: team.irina, left: 82, height: 94, z: 2, captionBottom: 38, mx: 0, lift: 130, fx: { word: 'Монтаж', color: '#C271FF', meta: 'CUT 01:24:12 → 01:26:03' } },
];

export interface Review {
  company: string;
  name: string;
  position: string;
  videoId: string;
}

/** Video testimonials — the four extra VK links the client identified as reviews. */
export const reviews: Review[] = [
  { company: 'ICL SERVICES', name: 'Ольга Бармакова', position: 'Старший маркетолог ICL SERVICES', videoId: '456239482' },
  { company: 'ВОЛЖСКАЯ СУДОХОДНАЯ КОМПАНИЯ', name: 'Олеся Палагина', position: 'Руководитель отдела персонала Волжской судоходной компании', videoId: '456239473' },
  { company: 'ФАУ «РОСДОРНИИ»', name: 'Васильева Эвелина', position: 'Начальник отдела пресс-службы ФАУ «Росдорнии»', videoId: '456239479' },
  { company: 'ООО «МЕТАЛЛКЛИНЕР»', name: 'Тимур Рустамов', position: 'Руководитель отдела продаж ООО «МеталлКлинер»', videoId: '456239475' },
];

/**
 * Phones never mount the VK player, so a review is a play card — it needs a frame behind it.
 * The studio's own interview and studio shots stand in (labelled as such on the card); VK does not
 * publish a still for these videos. TODO(studio): replace with a frame from each testimonial.
 */
export const reviewFrames: Record<string, Photo> = {
  '456239482': process.loftInterview,
  '456239473': process.boardroomSlider,
  '456239479': process.studioSet,
  '456239475': process.podcastStudio,
};

export const faq = [
  { q: 'С какого года работает студия?', a: 'Студия работает в сфере видеосъёмок для бизнеса с 2015 года.' },
  { q: 'В каких городах вы снимаете?', a: 'Москва, Казань, Санкт-Петербург и по всей России. Съёмки проводили в 25 городах.' },
  { q: 'Какие этапы входят в производство?', a: 'Сценарий, раскадровка, видеосъёмка, видеомонтаж, цветокоррекция, саунд-дизайн, графика. В тарифе «Старт» — базовый сценарий, видеосъёмка и видеомонтаж.' },
  { q: 'Сколько стоит видеоролик?', a: 'Ориентиры: «Старт» — от 90 000 ₽, «Стандарт» — от 350 000 ₽, «Комбо» — от 750 000 ₽. Финальная стоимость индивидуальна, тарифы не фиксированные. Заполнив бриф, вы получите индивидуальный расчёт коммерческого предложения.' },
  { q: 'Кто работает над проектом?', a: 'Команда из 15 специалистов: сценаристы, видеооператоры, монтажёры и другие мастера.' },
  { q: 'На чём снимаете?', a: 'Работаем на собственном съёмочном оборудовании стоимостью 5 000 000 ₽.' },
  { q: 'Сколько проектов уже сделано?', a: 'Создано более 2500 видеороликов для более 600 клиентов, более 45 000 часов опыта.' },
  { q: 'Как начать работу?', a: 'Заполнить бриф, позвонить или написать в WhatsApp либо Telegram — мы обсудим проект и подготовим расчёт.' },
];

/**
 * The cover clip. This Kinescope id is a 3:4 video — PORTRAIT, measured off the live page: the
 * player drew it 812px wide inside a frame 1080 tall.
 *
 * That one fact decides everything about how it is shown. Stretched across a widescreen cover it
 * is a ~3.5× blow-up, which is what "очень пиксельное" was; handed to a player inside a
 * widescreen box it gets fitted, which is what the tall panel with poster either side was. So on
 * a wide screen it is not a background at all — it is hung as a 3:4 frame about 470px across
 * (Cover.tsx → the gate), which is a *downscale* even on a retina laptop, and therefore sharp.
 * On a phone or a tablet, where the screen is itself tall, the same clip goes full-bleed and
 * covers honestly.
 *
 * 'embed' plays it through Kinescope's player, which negotiates its rendition against the size it
 * is drawn at — the reason the frame being small makes the picture better, not worse. 'file'
 * pulls the renditions below into a plain <video> instead. 'off' leaves the poster frame alone.
 */
export const coverVideo = {
  kinescopeId: '0TQrgNTzKbreqYdeWNtWnN',
  mode: 'embed' as 'embed' | 'file' | 'off',
  /** 'file' mode only, sharpest first; the browser steps down when one is missing. */
  renditions: ['1080p', '720p'],
};

/** Muted, looping, no controls, not interactive: a moving backdrop rather than a player. */
export const kinescopeEmbedUrl = (id: string) =>
  `https://kinescope.io/embed/${id}?autoplay=1&muted=1&loop=1&controls=0&playsinline=1`;

export const kinescopeFileUrl = (id: string, rendition: string) =>
  // #t=0.1 — the first frame of the file is black
  `https://kinescope.io/${id}/${rendition}#t=0.1`;

export const coverPoster = backgrounds.coverPodcastStudio;

export const caseFallbackFrames = { a: process.boardroomSlider, b: process.factoryJib };
