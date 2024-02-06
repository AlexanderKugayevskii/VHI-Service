import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import ClinicService from "src/services/ClinicService";

export const useAppealStore = defineStore("appeal", () => {
  const client = ref(null);

  const setClient = (item) => {
    client.value = item;
  };

  const clinic = ref(null); //можно выбрать 1 клинику
  const doctorsData = ref([]); //врачей
  const diagnosisData = ref(""); //диагноз
  const servicesData = ref(null); //сервисы

  const drug = reactive({
    drugName: "",
    drugAmount: 0,
    drugType: "",
    price: 0,
  });
  const setDrugName = (value) => {
    drug.drugName = value;
  };
  const setDrugAmount = (value) => {
    drug.drugAmount = value;
  };
  const setDrugType = (value) => {
    drug.drugType = value;
  };
  const setDrugPrice = (value) => {
    drug.price = value;
  };

  const drugsData = reactive({
    recipiePhoto: "",
    drugs: [],
  });

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

  const setDrugs = (drug) => {
    drugsData.drugs.push(drug);
    drug = {
      id,
      drugName: "",
      drugAmount: 0,
      drugType: "",
      price: 0,
    };
  };
  const setRecipe = (file) => {
    drugsData.recipiePhoto = file;
  };

  const clearDoctors = (doctor) => {
    doctorsData.value = doctorsData.value.filter(
      (item) => item.id !== doctor.id
    );
  };

  const clearServices = (service) => {
    servicesData.value = servicesData.value.filter(
      (item) => item.id !== service.id
    );
  };

  const clearDrugs = (drug) => {
    drugsData.drugs = drugsData.drugs.filter((item) => {
      return drug.id !== item.id;
    });
  };

  watch(clinic, () => {
    doctorsData.value = [];
    servicesData.value = [];
  });

  const fetchClinics = () => {
    return ClinicService.getClinics();
  };

  const fetchDoctors = () => {
    return ClinicService.getDoctors(clinic.value[0].id);
  };

  const fetchServices = () => {
    return ClinicService.getServices(clinic.value[0].id);
  };

  return {
    client,
    clinic,
    doctorsData,
    diagnosisData,
    servicesData,
    drug,
    drugsData,
    setDrugName,
    setDrugAmount,
    setDrugType,
    setDrugPrice,
    setClient,
    fetchClinics,
    fetchDoctors,
    fetchServices,
    setClinic,
    setDoctors,
    setDiagnosis,
    setDrugs,
    setServices,
    clearDoctors,
    clearServices,
    clearDrugs,
  };
});
