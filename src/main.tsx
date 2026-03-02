import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { LocaleProvider } from './i18n/locale-context';
import { RootStoreProvider } from './stores/root-store-context';
import { createRootStore } from './stores/root-store';
import './styles/global.scss';

const redirectPath = new URLSearchParams(window.location.search).get('redirect');
if (redirectPath) {
  window.history.replaceState({}, '', redirectPath);
}

if (window.history.scrollRestoration) {
  window.history.scrollRestoration = 'manual';
}

if (window.location.hash) {
  window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
}

window.scrollTo({ top: 0, behavior: 'auto' });

const rootStore = createRootStore();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LocaleProvider>
      <RootStoreProvider value={rootStore}>
        <App />
      </RootStoreProvider>
    </LocaleProvider>
  </React.StrictMode>
);
