import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import ClinicService from "src/services/ClinicService";

export const useAppealStore = defineStore("appeal", () => {
  const client = ref(null);

  const setClient = (item) => {
    client.value = item;
  };

  // const appealData = reactive({
  //   clinicName: client.value.clinicName,
  //   diagnosisName: client.value.diagnosisName,
  //   doctorName: client.value.doctorName,
  //   serviceName: client.value.serviceName,
  //   expenseAmount: client.value.expenseAmount,
  // });

  return {
    client,
    setClient,
  };
});
