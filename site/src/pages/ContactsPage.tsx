import { PageShell } from './PageShell';
import { Contact } from '@/components/sections/Contact';
import { Geography } from '@/components/sections/Geography';

export function ContactsPage() {
  return (
    <PageShell index="07" kicker="КАЗАНЬ · МОСКВА · САНКТ-ПЕТЕРБУРГ · ВСЯ РОССИЯ" title={<>Контак<em>ты</em></>}>
      <Contact />
      <Geography />
    </PageShell>
  );
}
