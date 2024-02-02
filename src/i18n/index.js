import { createI18n } from "vue-i18n";
// import messages from "src/i18n";
import pluralRules from "src/i18n/rules/pluralization";
import uz from "src/i18n/locales/uz.json";

const instance = createI18n({
  locale: import.meta.env.VITE_DEFAULT_LOCALE,
  fallbackLocale: import.meta.env.VITE_FALLBACK_LOCALE,
  legacy: false,
  globalInjection: true,
  messages: { uz },
  pluralRules,
});

export default instance;

export const i18n = instance.global;
