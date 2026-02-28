import { useMemo, useState } from 'react';
import { useI18n } from '../../i18n/locale-context';

const worldThemeClasses = ['world-card-grass', 'world-card-desert', 'world-card-ice', 'world-card-sky'] as const;

export const WorldSection = () => {
  const { message } = useI18n();
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const activeStageDetail = useMemo(() => {
    return message.world.details[activeStageIndex] ?? message.world.details[0];
  }, [activeStageIndex, message.world.details]);

  return (
    <section className="world-section screen-section" id="worlds">
      <header className="section-header section-header-world">
        <p className="section-kicker">{message.world.kicker}</p>
        <h2 className="section-title">{message.world.title}</h2>
      </header>

      <div className="world-grid" role="tablist" aria-label={message.world.kicker}>
        {message.world.items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={activeStageIndex === index}
            className={`world-card ${worldThemeClasses[index] ?? worldThemeClasses[0]} ${activeStageIndex === index ? 'is-active' : ''}`}
            onClick={() => setActiveStageIndex(index)}
          >
            <div className="world-badge">{message.world.stageLabel}</div>
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
          </button>
        ))}
      </div>

      <section className="world-stage-panel" role="tabpanel" aria-label={message.world.detailLabel}>
        <p className="world-stage-panel-kicker">{message.world.detailLabel}</p>
        <h3>{activeStageDetail.title}</h3>
        <p>{activeStageDetail.description}</p>
        <ul>
          {activeStageDetail.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </section>
  );
};
