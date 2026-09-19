import { PageShell } from './PageShell';
import { Tariffs } from '@/components/sections/Tariffs';
import { Faq } from '@/components/sections/Faq';

export function TariffsPage() {
  return (
    <PageShell index="03" kicker="СТАРТ · СТАНДАРТ · КОМБО" title={<>Тари<em>фы</em></>}>
      <Tariffs />
      <Faq />
    </PageShell>
  );
}
