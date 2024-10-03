import { defineStore } from "pinia";
import { ref } from "vue";
export const useCommonStore = defineStore("common", () => {
  const userInteracted = ref(false);

  const setUserInteracted = () => {
    userInteracted.value = true;
  };

  return {
    userInteracted,
    setUserInteracted,
  };
});
