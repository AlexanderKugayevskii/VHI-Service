import { defineStore } from "pinia";
import { ref } from "vue";
export const useCommonStore = defineStore("common", () => {
  const userInteracted = ref(false);
  const notificationCount = ref(0);

  const setUserInteracted = () => {
    userInteracted.value = true;
  };

  const setNotificationCount = (count) => {
    notificationCount.value = count;
  };

  return {
    userInteracted,
    notificationCount,
    setUserInteracted,
    setNotificationCount,
  };
});
