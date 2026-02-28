const showcaseItems = [
  {
    title: 'Power-Up Mindset',
    description: 'Small upgrades, repeated daily, beat random bursts of effort.'
  },
  {
    title: 'Co-Op Thinking',
    description: 'Strong teams win by sharing intent, not only tasks.'
  },
  {
    title: 'Boss-Level Focus',
    description: 'The final 10 percent is where the real craft appears.'
  }
];

export const ShowcaseSection = () => (
  <section className="showcase-section screen-section" id="showcase">
    <header className="section-header section-header-showcase">
      <p className="section-kicker">Playbook</p>
      <h2 className="section-title">Ideas that stay useful under pressure.</h2>
    </header>

    <div className="showcase-track" aria-label="Playbook cards">
      {showcaseItems.map((item, index) => (
        <article key={item.title} className="showcase-card" style={{ animationDelay: `${index * 0.12}s` }}>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </article>
      ))}
    </div>
  </section>
);
