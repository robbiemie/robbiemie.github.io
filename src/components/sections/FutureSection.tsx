import { useI18n } from '../../i18n/locale-context';

export const FutureSection = () => {
  const { message } = useI18n();

  return (
    <section className="future-section screen-section" id="future">
      <header className="section-header section-header-future">
        <p className="section-kicker">{message.future.kicker}</p>
        <h2 className="section-title">{message.future.title}</h2>
      </header>

      <div className="future-grid" aria-label={message.future.kicker}>
        {message.future.placeholders.map((item) => (
          <article key={item} className="future-card">
            <h3>{item}</h3>
            <p>{message.future.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};
