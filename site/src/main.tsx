import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import '@/styles/global.css';
import { App } from '@/App';

// Hash routing for hosts that cannot serve index.html for every path (preview builds).
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
