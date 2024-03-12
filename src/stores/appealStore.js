import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import AppealService from "src/services/AppealService";

export const useAppealStore = defineStore("appeal", () => {
  const loading = ref(null);
  const client = ref(null);

  const setClient = (item) => {
    client.value = item;
  };

  const clinics = ref([]);
  const selectedClinic = ref(null);

  const doctors = ref([]);
  const selectedDoctors = ref([]);

  const services = ref([]);
  const selectedServices = ref([]);

  const selectClinic = (clinic) => {
    selectedClinic.value = clinic;
  };

  const selectDoctors = (doctor) => {
    const index = selectedDoctors.value.findIndex(
      (item) => item.id === doctor.id
    );
    if (index > -1) {
      selectedDoctors.value.splice(index, 1);
    } else {
      selectedDoctors.value.push(doctor);
    }
  };

  const selectServices = (service) => {
    const index = selectedServices.value.findIndex(
      (item) => item.id === service.id
    );
    if (index > -1) {
      selectedServices.value.splice(index, 1);
    } else {
      selectedServices.value.push(service);
    }
  };

  const fetchClinics = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getClinics();
      clinics.value = response.data.data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchDoctors = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getDoctors(selectedClinic.value.id);
      doctors.value = response.data.data;
      console.log(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchServices = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getServices(selectedClinic.value.id);
      services.value = response.data.data;
      console.log(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const checkSelectedClinic = (option) =>
    selectedClinic.value?.id === option.id;
  const checkSelectedDoctors = (option) => {
    return selectedDoctors.value.some((doctor) => doctor?.id === option.id);
  };
  const checkSelectedServices = (option) => {
    return selectedServices.value.some((service) => service?.id === option.id);
  };

  watch(selectedClinic, () => {
    doctors.value = [];
    selectedDoctors.value = [];
    services.value = [];
    selectedServices.value = [];
  });

  const clearDoctors = (doctor) => {
    selectedDoctors.value = selectedDoctors.value.filter(
      (item) => item.id !== doctor.id
    );
  };
  const clearServices = (service) => {
    selectedServices.value = selectedServices.value.filter(
      (item) => item.id !== service.id
    );
  };
  const clearDrugs = (drug) => {
    drugsData.drugs = drugsData.drugs.filter((item) => {
      return drug.id !== item.id;
    });
  };

  return {
    loading,
    client,
    setClient,
    clinics,
    selectedClinic,
    doctors,
    selectedDoctors,
    services,
    selectedServices,
    fetchClinics,
    fetchDoctors,
    fetchServices,
    selectClinic,
    selectDoctors,
    selectServices,
    checkSelectedClinic,
    checkSelectedDoctors,
    checkSelectedServices,
    clearDoctors,
    clearServices,
  };
});
