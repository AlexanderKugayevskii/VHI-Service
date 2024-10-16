import { ref, computed } from "vue";
import { LocalStorage } from "quasar";

const dataArray = ref(LocalStorage.getItem("appealsHistory") || []);
export function useAppealsHistory() {
  function addData(clientAppealData) {
    if (dataArray.value.length >= 5) {
      dataArray.value.shift();
    }
    dataArray.value.push(clientAppealData);
    LocalStorage.set("appealsHistory", dataArray.value);
  }

  function clearData() {
    dataArray.value = [];
    LocalStorage.removeItem("appealsHistory");
  }

  function deleteData(appealId) {
    dataArray.value = dataArray.value.filter(
      (item) => item.appealId !== appealId
    );

    LocalStorage.set("appealsHistory", dataArray.value);
  }

  function getDataArray() {
    return dataArray.value;
  }

  return {
    dataArray,
    addData,
    getDataArray,
    clearData,
    deleteData,
  };
}
