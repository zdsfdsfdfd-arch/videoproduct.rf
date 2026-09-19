import { PageShell } from './PageShell';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { servicesTotal } from '@/content';

export function ServicesPage() {
  return (
    <PageShell index="02" kicker={`${servicesTotal} НАПРАВЛЕНИЙ · 7 ЭТАПОВ ПРОИЗВОДСТВА`} title={<>Услу<em>ги</em></>}>
      <Services />
      <Process />
    </PageShell>
  );
}
