import { useCallback, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';

const particleOptions: ISourceOptions = {
  fullScreen: false,
  detectRetina: true,
  background: {
    color: '#72c8ff'
  },
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        width: 1200,
        height: 1200
      }
    },
    color: {
      value: ['#ffffff', '#ffdb4d', '#ff6a55', '#48b2ff', '#62bf5a']
    },
    opacity: {
      value: 0.5,
      animation: {
        enable: true,
        speed: 0.4
      }
    },
    size: {
      value: { min: 2, max: 4 }
    },
    shape: {
      type: ['square', 'circle']
    },
    move: {
      enable: true,
      speed: 0.3,
      outModes: {
        default: 'out'
      }
    }
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'repulse'
      },
      resize: {
        enable: true
      }
    },
    modes: {
      repulse: {
        distance: 95,
        duration: 0.35
      }
    }
  }
};

void initParticlesEngine(async (engine: Engine) => {
  await loadSlim(engine);
});

export const ParticleBackdrop = () => {
  const options = useMemo(() => particleOptions, []);

  const handleParticlesLoaded = useCallback(async () => {
    return Promise.resolve();
  }, []);

  return (
    <div className="particle-layer" aria-hidden="true">
      <Particles id="particle-canvas" options={options} particlesLoaded={handleParticlesLoaded} />
    </div>
  );
};
