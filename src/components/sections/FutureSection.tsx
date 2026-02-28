const placeholders = [
  'Module Placeholder A',
  'Module Placeholder B',
  'Module Placeholder C'
];

export const FutureSection = () => (
  <section className="future-section screen-section" id="future">
    <header className="section-header section-header-future">
      <p className="section-kicker">Coming Next</p>
      <h2 className="section-title">Reserved fifth screen for upcoming content.</h2>
    </header>

    <div className="future-grid" aria-label="Future placeholders">
      {placeholders.map((item) => (
        <article key={item} className="future-card">
          <h3>{item}</h3>
          <p>Placeholder slot reserved for future business modules.</p>
        </article>
      ))}
    </div>
  </section>
);
