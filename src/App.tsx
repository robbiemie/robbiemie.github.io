import { observer } from 'mobx-react-lite';
import { LanguageSwitch } from './components/common/LanguageSwitch';
import { ParticleBackdrop } from './components/effects/ParticleBackdrop';
import { HeroSection } from './components/sections/HeroSection';
import { WorldSection } from './components/sections/WorldSection';
import { usePageState } from './hooks/usePageState';

export const App = observer(() => {
  const { isReady } = usePageState();

  return (
    <div className="app-shell" data-ready={isReady}>
      <ParticleBackdrop />
      <LanguageSwitch />
      <main className="app-main">
        <HeroSection />
        <WorldSection />
      </main>
    </div>
  );
});
