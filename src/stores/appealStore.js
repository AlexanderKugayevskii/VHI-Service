import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppealStore = defineStore("appeal", () => {
  const client = ref(null);

  const setClient = (item) => {
    client.value = item;
  };



  return {
    client,
    setClient,
  };
});
