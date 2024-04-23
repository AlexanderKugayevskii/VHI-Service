import { computed } from "vue";
import Trans from "src/i18n/translation";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

import "dayjs/locale/ru"; // Импортируем локаль для русского языка
import "dayjs/locale/uz-latn"; // Импортируем локаль для узбекского языка

export default function useDay() {
  const i18n = useI18n();

  const currentLocale = computed(() =>
    Trans.currentLocale === "uz" ? "uz-latn" : Trans.currentLocale
  );

  const today = computed(() => {
    console.log("today", currentLocale.value);
    return (
      i18n.t("days.today") +
      " " +
      dayjs().locale(currentLocale.value).format(`D MMMM`)
    );
  });

  const yesterday = computed(() => {
    console.log("yesterday", currentLocale.value);
    return (
      i18n.t("days.yesterday") +
      " " +
      dayjs().locale(currentLocale.value).subtract(1, "day").format(`D MMMM`)
    );
  });

  return { today, yesterday };
}
