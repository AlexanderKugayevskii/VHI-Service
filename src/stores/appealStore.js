import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import ClinicService from "src/services/ClinicService";

export const useAppealStore = defineStore("appeal", () => {
  // const loading = ref(false);
  // const error = ref(false);

  const client = ref(null);

  const setClient = (item) => {
    client.value = item;
  };

  const clinic = ref(null); //можно выбрать 1 клинику
  const doctorsData = ref(null); //врачей
  const diagnosisData = ref(""); //диагноз
  const servicesData = ref(null); //сервисы

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
  const setServices = (services) => {
    servicesData.value = services;
  };

  watch(clinic, () => {
    doctorsData.value = null;
    servicesData.value = null;
  });

  const fetchClinics = () => {
    return ClinicService.getClinics();
  };

  const fetchDoctors = () => {
    return ClinicService.getDoctors(clinic.value[0].id);
  };
  // const fetchDoctors = async () => {
  //   try {
  //     const response = await ClinicService.getDoctors(clinic.value[[0]].id);
  //     const data = response.data;
  //     console.log(data);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const fetchServices = () => {
    return ClinicService.getServices(clinic.value[0].id);
  };

  return {
    client,
    clinic,
    doctorsData,
    diagnosisData,
    servicesData,
    setClient,
    fetchClinics,
    fetchDoctors,
    fetchServices,
    setClinic,
    setDoctors,
    setDiagnosis,
    setServices,
  };
});
