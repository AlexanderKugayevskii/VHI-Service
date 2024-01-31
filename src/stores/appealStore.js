import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import ClinicService from "src/services/ClinicService";

export const useAppealStore = defineStore("appeal", () => {
  const client = ref(null);
  const setClient = (item) => {
    client.value = item;
  };

  const clinicsData = ref([]);
  const clinic = ref(null);
  const doctorsData = ref(null);
  const diagnosisData = ref("");

  const setClinic = (selectedClinic) => {
    clinic.value = selectedClinic;
  };
  const setDoctors = (selectedDoctors) => {
    doctorsData.value = selectedDoctors;
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
