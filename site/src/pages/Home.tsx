import { useOpenCase } from '@/App';
import { useIsDesktop } from '@/lib/hooks';
import { Cover } from '@/components/sections/Cover';
import { Clients } from '@/components/sections/Clients';
import { Intro } from '@/components/sections/Intro';
import { Works } from '@/components/sections/Works';
import { Process } from '@/components/sections/Process';
import { Services } from '@/components/sections/Services';
import { Backstage } from '@/components/sections/Backstage';
import { Tariffs } from '@/components/sections/Tariffs';
import { Team } from '@/components/sections/Team';
import { Reviews } from '@/components/sections/Reviews';
import { Brief } from '@/components/sections/Brief';
import { Geography } from '@/components/sections/Geography';
import { Faq } from '@/components/sections/Faq';
import { Contact } from '@/components/sections/Contact';

/** The magazine: cover + 12 spreads, the scroll story «от идеи до кадра». */
export function Home() {
  const openCase = useOpenCase();
  const desktop = useIsDesktop();
  return (
    <>
      <Cover />
      <Clients />
      <Intro />
      <Works onOpen={openCase} />
      <Process />
      <Services />
      {/* «За кадром» is a desktop chapter — see content → phoneHiddenSections */}
      {desktop && <Backstage />}
      <Tariffs />
      <Team />
      <Reviews />
      <Brief />
      <Geography />
      <Faq />
      <Contact />
    </>
  );
}
