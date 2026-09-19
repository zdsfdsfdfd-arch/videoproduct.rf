import { PageShell } from './PageShell';
import { Brief } from '@/components/sections/Brief';
import { Tariffs } from '@/components/sections/Tariffs';

export function BriefPage() {
  return (
    <PageShell index="06" kicker="5 ШАГОВ · ~1,5 МИНУТЫ · ИНДИВИДУАЛЬНЫЙ РАСЧЁТ" title={<>Бр<em>иф</em></>} lead="Один вопрос на экран, следующий зависит от ответа. В конце — ориентир по тарифу и расчёт от команды студии.">
      <Brief />
      <Tariffs />
    </PageShell>
  );
}
