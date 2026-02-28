import { useI18n } from '../../i18n/locale-context';

const worldThemeClasses = ['world-card-grass', 'world-card-desert', 'world-card-ice', 'world-card-sky'] as const;

export const WorldSection = () => {
  const { message } = useI18n();

  return (
    <section className="world-section screen-section" id="worlds">
      <header className="section-header section-header-world">
        <p className="section-kicker">{message.world.kicker}</p>
        <h2 className="section-title">{message.world.title}</h2>
      </header>

      <div className="world-grid">
        {message.world.items.map((item, index) => (
          <article key={item.title} className={`world-card ${worldThemeClasses[index] ?? worldThemeClasses[0]}`}>
            <div className="world-badge">{message.world.stageLabel}</div>
            <h3>{item.title}</h3>
            <p>{item.subtitle}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
