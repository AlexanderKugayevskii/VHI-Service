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
    return (
      i18n.t("days.today") +
      ", " +
      dayjs().locale(currentLocale.value).format(`D MMMM`)
    );
  });

  const yesterday = computed(() => {
    return (
      i18n.t("days.yesterday") +
      ", " +
      dayjs().locale(currentLocale.value).subtract(1, "day").format(`D MMMM`)
    );
  });

  const isToday = (date) => {
    const today = dayjs().startOf("day");
    const givenDate = dayjs(date).startOf("day");

    return today.isSame(givenDate, "day");
  };
  const isYesterday = (date) => {
    const yesterday = dayjs().subtract(1, "day").startOf("day");
    const givenDate = dayjs(date).startOf("day");

    return yesterday.isSame(givenDate, "day");
  };

  return { today, yesterday, currentLocale, isToday, isYesterday };
}
