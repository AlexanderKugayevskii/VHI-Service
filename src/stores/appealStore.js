import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import AppealService from "src/services/AppealService";

export const useAppealStore = defineStore("appeal", () => {
  const loading = ref(null);
  const successAppeal = ref(false);
  const client = ref(null);

  const setSuccessAppeal = (flag) => {
    successAppeal.value = flag;
  };

  const setClient = (item) => {
    client.value = item;
  };

  const diagnosis = ref("");

  const setDiagnosis = (value) => {
    diagnosis.value = value;
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
      (item) => item?.id === doctor.id
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
      console.log(clinics.value);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchHospitalData = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getHospitalDataById(
        selectedClinic.value.id
      );
      const data = response.data.data;
      doctors.value = data.doctors;
      services.value = data.med_services;
      console.log(data);
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
  const postAppealData = async () => {
    loading.value = true;
    
    const payload = {
      hospital_id: selectedClinic.value.id,
      contract_client_id: client.value.id,
      client_type: 0,
      client_id: client.value.clientId,
      services: selectedServices.value.map((service) => {
        return { id: service.id, price: service.pivot.price };
      }),
      doctors: selectedDoctors.value.map((doctor) => {
        return { id: doctor.id, price: doctor.pivot.price };
      }),
      diagnosis: diagnosis.value,
    };
    console.log(payload);
    try {
      const response = await AppealService.saveAppealByAgent(payload);
      console.log(`response`, response);
      if (
        response.status === 200 &&
        response.data.message === "created successfully"
      ) {
        setSuccessAppeal(true);
      }
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
    successAppeal,
    setSuccessAppeal,
    client,
    setClient,
    diagnosis,
    setDiagnosis,
    clinics,
    selectedClinic,
    doctors,
    selectedDoctors,
    services,
    selectedServices,
    fetchClinics,
    fetchDoctors,
    fetchServices,
    fetchHospitalData,
    selectClinic,
    selectDoctors,
    selectServices,
    checkSelectedClinic,
    checkSelectedDoctors,
    checkSelectedServices,
    clearDoctors,
    clearServices,
    postAppealData,
  };
});
