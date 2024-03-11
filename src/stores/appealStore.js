import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import AppealService from "src/services/AppealService";

export const useAppealStore = defineStore("appeal", () => {
  const loading = ref(null); 
  const client = ref(null);

  const setClient = (item) => {
    client.value = item;
  };

  const clinics = ref(null);
  const selectedClinic = ref(null);

  const selectClinic = (clinic) => {
    selectedClinic.value = clinic;
  };
  //можно выбрать 1 клинику

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

  const fetchClinics = async () => {
    loading.value = true; 
    try {
      const response = await AppealService.getClinics();
      clinics.value = response.data; 
      console.log(clinics.value);
    } catch (e) {
      
    } finally {
      loading.value = false; 
    }
  };

  watch(selectedClinic, () => {
  });

  return {
    loading,
    client,
    clinics,
    selectedClinic,
    fetchClinics,
    selectClinic,
  };
});
