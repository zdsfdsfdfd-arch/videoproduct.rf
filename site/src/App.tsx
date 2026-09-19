import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { getEngine, scrollToSection } from '@/lib/scroll-engine';
import { pageTitle } from '@/lib/routes';
import { Perforation } from '@/components/chrome/Perforation';
import { ProgressBar } from '@/components/chrome/ProgressBar';
import { Cursor } from '@/components/chrome/Cursor';
import { TopBars } from '@/components/chrome/TopBars';
import { SideNav, MiniNav } from '@/components/chrome/Nav';
import { MobileMenu } from '@/components/chrome/MobileMenu';
import { CaseOverlay, type CaseRequest } from '@/components/CaseOverlay';
import { Home } from '@/pages/Home';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { ServicesPage } from '@/pages/ServicesPage';
import { TariffsPage } from '@/pages/TariffsPage';
import { TeamPage } from '@/pages/TeamPage';
import { ReviewsPage } from '@/pages/ReviewsPage';
import { BriefPage } from '@/pages/BriefPage';
import { ContactsPage } from '@/pages/ContactsPage';
import styles from './App.module.css';

type OpenCase = (index: number, thumb: HTMLElement) => void;
const CaseContext = createContext<OpenCase>(() => {});
/** Any page can open the cinematic case overlay through this. */
export const useOpenCase = () => useContext(CaseContext);

export function App() {
  const [caseReq, setCaseReq] = useState<CaseRequest | null>(null);
  const location = useLocation();

  useEffect(() => {
    const engine = getEngine();
    engine.start();
    return () => engine.stop();
  }, []);

  // route change: new sections → rescan; scroll to top or to the hash; page title
  useEffect(() => {
    document.title = pageTitle(location.pathname);
    setCaseReq(null);
    const t = setTimeout(() => {
      getEngine().scan();
      if (location.hash) scrollToSection(location.hash.slice(1));
      else scrollTo({ top: 0, behavior: 'auto' });
    }, 0);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  const openCase = useCallback<OpenCase>((index, thumb) => {
    setCaseReq({ index, rect: thumb.getBoundingClientRect() });
  }, []);

  return (
    <CaseContext.Provider value={openCase}>
      <div className={styles.root}>
        <Perforation side="left" />
        <Perforation side="right" />
        <ProgressBar />
        <Cursor />
        <TopBars />
        <MobileMenu />
        <SideNav />
        <MiniNav />

        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/uslugi" element={<ServicesPage />} />
            <Route path="/tarify" element={<TariffsPage />} />
            <Route path="/komanda" element={<TeamPage />} />
            <Route path="/otzyvy" element={<ReviewsPage />} />
            <Route path="/brif" element={<BriefPage />} />
            <Route path="/kontakty" element={<ContactsPage />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <CaseOverlay request={caseReq} onClose={() => setCaseReq(null)} />
      </div>
    </CaseContext.Provider>
  );
}
