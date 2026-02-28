import { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { Locale } from './messages';
import { messages } from './messages';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
};

const LOCALE_STORAGE_KEY = 'site-locale';

const detectDefaultLocale = (): Locale => {
  const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (savedLocale === 'zh' || savedLocale === 'en') {
    return savedLocale;
  }

  return navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export const LocaleProvider = ({ children }: PropsWithChildren) => {
  const [locale, setLocaleState] = useState<Locale>(() => detectDefaultLocale());

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
  };

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale
    }),
    [locale]
  );

  return <LocaleContext.Provider value={contextValue}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('LocaleProvider is missing in component tree.');
  }

  return context;
};

export const useI18n = () => {
  const { locale, setLocale } = useLocale();

  return {
    locale,
    setLocale,
    message: messages[locale]
  };
};
