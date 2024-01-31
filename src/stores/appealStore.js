import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import ClinicService from "src/services/ClinicService";

export const useAppealStore = defineStore("appeal", () => {
  const client = ref(null);

  const setClient = (item) => {
    client.value = item;
  };

  const clinicsData = ref([]);
  const clinic = ref(null); //можно выбрать 1 клинику
  const doctorsData = ref(null); //врачей
  const diagnosisData = ref(""); //диагноз

  const setClinic = (selectedClinic) => {
    clinic.value = selectedClinic;
    console.log(clinic.value);
  };
  const setDoctors = (selectedDoctors) => {
    doctorsData.value = selectedDoctors;
    console.log(doctorsData.value);
  };
  const setDiagnosis = (diagnosis) => {
    diagnosisData.value = diagnosis;
  };

  watch(clinic, () => {
    doctorsData.value = null;
  });

  const fetchClinics = () => {
    return ClinicService.getClinics();
  };

  const fetchDoctors = () => {
    return ClinicService.getDoctors(clinic.value.id);
  };

  return {
    client,
    clinic,
    doctorsData,
    diagnosisData,
    setClient,
    fetchClinics,
    fetchDoctors,
    setClinic,
    setDoctors,
    setDiagnosis,
  };
});
