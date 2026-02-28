import { useI18n } from '../../i18n/locale-context';

export const KnowledgeSection = () => {
  const { message } = useI18n();

  return (
    <section className="knowledge-section screen-section" id="knowledge">
      <div className="knowledge-content">
        <p className="section-kicker">{message.knowledge.kicker}</p>
        <h2 className="section-title">{message.knowledge.title}</h2>
        <p className="knowledge-description">{message.knowledge.description}</p>
        <a
          className="knowledge-link"
          href="https://www.yangoogle.com/keep-learning"
          target="_blank"
          rel="noreferrer"
        >
          {message.knowledge.action}
        </a>
      </div>
    </section>
  );
};
