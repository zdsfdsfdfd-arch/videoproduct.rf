// Branching brief: the second question depends on the first answer; the result maps the
// third answer (production scale) onto the three real tariffs.

export interface BriefStep {
  question: string;
  options: string[];
}

const GOAL_SCRIPTED = 'Рассказать о компании, продукции, услугах и др. (ролик по сценарию)';

const formatsByGoal: Record<string, string[]> = {
  [GOAL_SCRIPTED]: ['Презентационное видео', 'Имиджевый ролик', 'Рекламный видеоролик', 'Информационный ролик'],
  'Показать производство и процессы': ['Производственные видео', 'Отчётный ролик', 'Видеоинструкции для бизнеса'],
  'Снять мероприятие или форум': ['Видеосъёмка мероприятий', 'Видеосъёмка форумов', 'Отчётные ролики'],
  'Записать интервью или подкаст': ['Съёмка интервью и подкастов', 'Видеообращение от CEO', 'Обучающие видео и видеокурсы'],
};

export const SCALE_FAST = 'Быстро, без большого препродакшна';
export const SCALE_FULL = 'Все этапы производства под задачу';
export const SCALE_MAX = 'Максимум: командировки, много специалистов';

export function briefFlow(answers: string[]): BriefStep[] {
  const goal = answers[0] ?? '';
  return [
    { question: 'Какова главная цель видеоролика?', options: Object.keys(formatsByGoal) },
    { question: 'Какой формат ближе к задаче?', options: formatsByGoal[goal] ?? formatsByGoal[GOAL_SCRIPTED] },
    { question: 'Какой объём производства нужен?', options: [SCALE_FAST, SCALE_FULL, SCALE_MAX] },
    { question: 'Насколько срочно?', options: ['Срочный заказ', 'Плановый проект', 'Пока выбираем подрядчика'] },
  ];
}

/** Total steps shown in the progress label: 4 questions + contacts. */
export const BRIEF_TOTAL = 5;

export function briefResult(answers: string[]): { title: string; note: string } {
  const scale = answers[2] ?? '';
  const [title, body] =
    scale === SCALE_FAST
      ? ['Тариф «Старт» — от 90 000 ₽', 'Базовый сценарий, видеосъёмка, видеомонтаж. Минимальный препродакшн и небольшая команда.']
      : scale === SCALE_MAX
        ? ['Тариф «Комбо» — от 750 000 ₽', 'Самый насыщенный тариф: широкая география, командировки, много специалистов. Минимум компромиссов.']
        : ['Тариф «Стандарт» — от 350 000 ₽', 'Сценарий, раскадровка, съёмка, монтаж, цветокоррекция, саунд-дизайн, графика.'];
  return { title, note: `${body} Финальная стоимость индивидуальна, тарифы не фиксированные.` };
}
