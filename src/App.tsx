import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { LanguageSwitch } from './components/common/LanguageSwitch';
import { ParticleBackdrop } from './components/effects/ParticleBackdrop';
import { CyberMuyuSection } from './components/sections/CyberMuyuSection';
import { HeroSection } from './components/sections/HeroSection';
import { ToolsPage, type ToolsRouteKey } from './components/sections/ToolsPage';
import { WorldSection } from './components/sections/WorldSection';
import { usePageState } from './hooks/usePageState';

type AppRoute = {
  shell: 'home' | 'tools';
  toolsRoute: ToolsRouteKey;
};

const getRoute = (): AppRoute => {
  const basePath = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;
  const pathname = window.location.pathname;
  const strippedPath = pathname.startsWith(normalizedBase) ? pathname.slice(normalizedBase.length - 1) : pathname;

  if (strippedPath === '/tools' || strippedPath === '/tools/') {
    return { shell: 'tools', toolsRoute: 'overview' };
  }

  if (strippedPath.startsWith('/tools/')) {
    const segment = strippedPath.replace('/tools/', '').split('/')[0];
    if (segment === 'html' || segment === 'json' || segment === 'url' || segment === 'regex') {
      return { shell: 'tools', toolsRoute: segment };
    }
    return { shell: 'tools', toolsRoute: 'overview' };
  }

  return { shell: 'home', toolsRoute: 'overview' };
};

const HomeShell = observer(() => {
  const { isReady } = usePageState();

  return (
    <div className="app-shell" data-ready={isReady}>
      <ParticleBackdrop />
      <LanguageSwitch />
      <main className="app-main">
        <HeroSection />
        <WorldSection />
        <CyberMuyuSection />
      </main>
    </div>
  );
});

const ToolsShell = ({ toolsRoute }: { toolsRoute: ToolsRouteKey }) => {
  return (
    <div className="app-shell" data-ready="true">
      <ParticleBackdrop />
      <LanguageSwitch />
      <main className="app-main">
        <ToolsPage activeTool={toolsRoute} />
      </main>
    </div>
  );
};

export const App = () => {
  const [route, setRoute] = useState<AppRoute>(() => getRoute());

  useEffect(() => {
    const onPopState = () => {
      setRoute(getRoute());
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  if (route.shell === 'tools') {
    return <ToolsShell toolsRoute={route.toolsRoute} />;
  }

  return <HomeShell />;
};
