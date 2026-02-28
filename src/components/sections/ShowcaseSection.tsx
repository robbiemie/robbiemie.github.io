import { useI18n } from '../../i18n/locale-context';

export const ShowcaseSection = () => {
  const { message } = useI18n();

  return (
    <section className="showcase-section screen-section" id="showcase">
      <header className="section-header section-header-showcase">
        <p className="section-kicker">{message.showcase.kicker}</p>
        <h2 className="section-title">{message.showcase.title}</h2>
      </header>

      <div className="showcase-track" aria-label={message.showcase.kicker}>
        {message.showcase.items.map((item, index) => (
          <article key={item.title} className="showcase-card" style={{ animationDelay: `${index * 0.12}s` }}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
