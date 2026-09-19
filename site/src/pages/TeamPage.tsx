import { PageShell } from './PageShell';
import { Team } from '@/components/sections/Team';
import { Clients } from '@/components/sections/Clients';
import { Backstage } from '@/components/sections/Backstage';

export function TeamPage() {
  return (
    <PageShell index="04" kicker="15 СПЕЦИАЛИСТОВ · КАЗАНЬ · СТУДИЯ" title={<>Коман<em>да</em></>} lead="Сценаристы, видеооператоры, монтажёры, звук, свет, грим. Наведите на человека — увидите его ремесло.">
      <Team />
      <Backstage />
      <Clients />
    </PageShell>
  );
}
