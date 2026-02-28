import { useI18n } from '../../i18n/locale-context';

export const LanguageSwitch = () => {
  const { locale, setLocale, message } = useI18n();

  return (
    <div className="language-switch" aria-label={message.localeLabel}>
      <button
        type="button"
        className={`language-switch-button ${locale === 'zh' ? 'is-active' : ''}`}
        onClick={() => setLocale('zh')}
      >
        {'中'}
      </button>
      <button
        type="button"
        className={`language-switch-button ${locale === 'en' ? 'is-active' : ''}`}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
    </div>
  );
};
