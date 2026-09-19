import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import '@/styles/global.css';
import { App } from '@/App';

// Hash routing for hosts that cannot serve index.html for every path (preview builds).
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;
// under a sub-path (GitHub Pages) the router needs the same base Vite built the assets with
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename={basename}>
      <App />
    </Router>
  </StrictMode>,
);
