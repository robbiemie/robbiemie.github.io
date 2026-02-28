const worldItems = [
  {
    title: 'Grass World',
    subtitle: 'Start with courage, finish with kindness.',
    themeClass: 'world-card-grass'
  },
  {
    title: 'Desert World',
    subtitle: 'Heat reveals what comfort hides.',
    themeClass: 'world-card-desert'
  },
  {
    title: 'Ice World',
    subtitle: 'Calm thinking saves momentum.',
    themeClass: 'world-card-ice'
  },
  {
    title: 'Sky World',
    subtitle: 'Perspective turns fear into play.',
    themeClass: 'world-card-sky'
  }
];

export const WorldSection = () => (
  <section className="world-section screen-section" id="worlds">
    <header className="section-header section-header-world">
      <p className="section-kicker">Choose A World</p>
      <h2 className="section-title">Each world is a way to think.</h2>
    </header>

    <div className="world-grid">
      {worldItems.map((item) => (
        <article key={item.title} className={`world-card ${item.themeClass}`}>
          <div className="world-badge">Stage</div>
          <h3>{item.title}</h3>
          <p>{item.subtitle}</p>
        </article>
      ))}
    </div>
  </section>
);
