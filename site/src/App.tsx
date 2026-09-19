import { useEffect, useState, useCallback } from 'react';
import { getEngine } from '@/lib/scroll-engine';
import { Perforation } from '@/components/chrome/Perforation';
import { ProgressBar } from '@/components/chrome/ProgressBar';
import { Cursor } from '@/components/chrome/Cursor';
import { TopBars } from '@/components/chrome/TopBars';
import { SideNav, MiniNav } from '@/components/chrome/Nav';
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
import { CaseOverlay, type CaseRequest } from '@/components/CaseOverlay';
import styles from './App.module.css';

export function App() {
  const [caseReq, setCaseReq] = useState<CaseRequest | null>(null);

  useEffect(() => {
    const engine = getEngine();
    engine.start();
    engine.scan();
    return () => engine.stop();
  }, []);

  const openCase = useCallback((index: number, thumb: HTMLElement) => {
    setCaseReq({ index, rect: thumb.getBoundingClientRect() });
  }, []);

  return (
    <div className={styles.root}>
      <Perforation side="left" />
      <Perforation side="right" />
      <ProgressBar />
      <Cursor />
      <TopBars />
      <SideNav />
      <MiniNav />

      <main className={styles.main}>
        <Cover />
        <Clients />
        <Intro />
        <Works onOpen={openCase} />
        <Process />
        <Services />
        <Backstage />
        <Tariffs />
        <Team />
        <Reviews />
        <Brief />
        <Geography />
        <Faq />
        <Contact />
      </main>

      <CaseOverlay request={caseReq} onClose={() => setCaseReq(null)} />
    </div>
  );
}
