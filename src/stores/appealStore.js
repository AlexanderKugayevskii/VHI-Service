import { defineStore } from "pinia";
import { ref, reactive, watch, registerRuntimeCompiler, computed } from "vue";
import AppealService from "src/services/AppealService";
import ClientService from "src/services/ClientService";
import { useAuthStore } from "./authStore";
import { storeToRefs } from "pinia";
import { all } from "axios";

const TYPE_OF_APPEALS = {
  NEW: 0,
  CHANGE: 1,
};

function filterItems(data, suggestedArr, selectedArr, isClinic) {
  data.forEach((item) => {
    const createdByClinic = item.pivot.created_by_clinic === 0;
    if (isClinic) {
      if (createdByClinic) {
        suggestedArr.push(item);
      } else {
        selectedArr.push(item);
      }
    } else {
      if (createdByClinic) {
        selectedArr.push(item);
      } else {
        suggestedArr.push(item);
      }
    }
  });
}

export const useAppealStore = defineStore("appeal", () => {
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  const isClinic = user.value.role.id === 8;

  const loading = ref(null);
  const successAppeal = ref(false);
  const client = ref(null);
  const typeOfAppeal = ref(0);
  const setSuccessAppeal = (flag) => {
    successAppeal.value = flag;
  };

  const setTypeOfAppeal = (type) => {
    console.log(type);
    typeOfAppeal.value = TYPE_OF_APPEALS[type];
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
  const suggestedDoctors = ref([]);
  const allDoctorsStatus = computed(() =>
    selectedDoctors.value.concat(suggestedDoctors.value).map((doctor) => {
      return {
        id: doctor.id,
        status: doctor.pivot.status ?? 0,
      };
    })
  );

  const services = ref([]);
  const selectedServices = ref([]);
  const suggestedServices = ref([]);
  const allServicesStatus = computed(() =>
    selectedServices.value.concat(suggestedServices.value).map((service) => {
      return {
        id: service.id,
        status: service.pivot.status ?? 0,
      };
    })
  );

  const appealTotalConsumption = computed(() => {
    const allData = [
      ...selectedDoctors.value,
      ...suggestedDoctors.value,
      ...selectedServices.value,
      ...suggestedServices.value,
    ];

    return allData.reduce((acc, curr) => acc + Number(curr.pivot.price), 0);
  });

  const selectClinic = (clinic) => {
    selectedClinic.value = clinic;
    clearAppealData();
  };

  const setClinic = async () => {
    if (user.value.role.id === 8) {
      selectedClinic.value = user.value.hospital;
      await fetchHospitalData();
    }
  };

  const checkSuggestedDoctors = (doctor) => {
    return suggestedDoctors.value.some((item) => doctor.id === item.id);
  };
  const selectDoctors = (doctor) => {
    if (checkSuggestedDoctors(doctor)) {
      return;
    }

    const index = selectedDoctors.value.findIndex(
      (item) => item?.id === doctor.id
    );
    if (index > -1) {
      selectedDoctors.value.splice(index, 1);
    } else {
      selectedDoctors.value.push(doctor);
    }
  };

  const checkSuggestedServices = (service) => {
    return suggestedServices.value.some((item) => service.id === item.id);
  };
  const selectServices = (service) => {
    if (checkSuggestedServices(service)) {
      return;
    }

    const index = selectedServices.value.findIndex(
      (item) => item.id === service.id
    );
    if (index > -1) {
      selectedServices.value.splice(index, 1);
    } else {
      selectedServices.value.push(service);
    }
  };

  const clearAppealData = () => {
    doctors.value = [];
    services.value = [];
    selectedDoctors.value = [];
    selectedServices.value = [];
    suggestedDoctors.value = [];
    suggestedServices.value = [];
  };
  const clearClinicData = () => {
    selectedClinic.value = [];
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

  const fetchHospitalData = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getHospitalDataById(
        selectedClinic.value.id
      );
      const data = response.data.data;
      doctors.value = data.doctors;
      services.value = data.med_services;
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
      services: selectedServices.value.map((service) => service.id),
      doctors: selectedDoctors.value.map((doctor) => doctor.id),
      diagnosis: diagnosis.value,
    };
    try {
      const response = await AppealService.saveAppealByAgent(payload);
      if (
        response.status === 200 &&
        response.data.message === "created successfully"
      ) {
        setSuccessAppeal(true);
        clearAppealData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const changeAppealData = async () => {
    loading.value = true;
    const payload = {
      hospital_id: selectedClinic.value.id,
      contract_client_id: client.value.id,
      client_type: 0,
      client_id: client.value.clientId,
      services: allServicesStatus.value,
      doctors: allDoctorsStatus.value,
      diagnosis: diagnosis.value,
    };
    try {
      const response = await AppealService.changeAppealData(
        client.value.appealId,
        payload
      );

      if (response.status === 200 && response.data.message === "success") {
        setSuccessAppeal(true);
        clearAppealData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const fetchApplicantData = async () => {
    loading.value = true;
    try {
      const response = await ClientService.getClientByAppealId(
        client.value.appealId
      );
      const data = response.data.data;

      client.value.id = data.contract_client.id;
      client.value.clientId = data.contract_client.client_id;

      selectedClinic.value = data.hospital;
      diagnosis.value = data.diagnosis;

      filterItems(
        data.doctors,
        suggestedDoctors.value,
        selectedDoctors.value,
        isClinic
      );

      filterItems(
        data.services,
        suggestedServices.value,
        selectedServices.value,
        isClinic
      );

      console.log(`Suggested by other`, suggestedDoctors.value);
      console.log(`Selected by owner`, selectedDoctors.value);
      console.log("-------------------------------------");
      console.log(`Suggested by other`, suggestedServices.value);
      console.log(`Selected by owner`, selectedServices.value);
    } catch (e) {
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

  const clearDoctors = (doctor) => {
    selectedDoctors.value = selectedDoctors.value.filter(
      (item) => item.id !== doctor.id
    );
  };
  const changeStatusDoctor = (selectedItem) => {
    suggestedDoctors.value = suggestedDoctors.value.map((doctor) => {
      if (selectedItem.item.id === doctor.id) {
        return {
          ...doctor,
          pivot: {
            ...doctor.pivot,
            status: selectedItem.status,
          },
          status: selectedItem.status,
        };
      }
      return doctor;
    });
  };

  const changeStatusService = (selectedItem) => {
    suggestedServices.value = suggestedServices.value.map((service) => {
      if (selectedItem.item.id === service.id) {
        return {
          ...service,
          pivot: {
            ...service.pivot,
            status: selectedItem.status,
          },
          status: selectedItem.status,
        };
      }
      return service;
    });
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
    isClinic,
    appealTotalConsumption,
    successAppeal,
    setSuccessAppeal,
    typeOfAppeal,
    setTypeOfAppeal,
    client,
    setClient,
    diagnosis,
    setDiagnosis,
    clinics,
    selectedClinic,
    doctors,
    selectedDoctors,
    suggestedDoctors,
    services,
    selectedServices,
    suggestedServices,
    fetchClinics,
    fetchDoctors,
    fetchServices,
    fetchHospitalData,
    fetchApplicantData,
    selectClinic,
    selectDoctors,
    selectServices,
    checkSelectedClinic,
    checkSelectedDoctors,
    checkSelectedServices,
    clearDoctors,
    clearServices,
    postAppealData,
    changeAppealData,
    clearAppealData,
    clearClinicData,
    setClinic,
    changeStatusDoctor,
    changeStatusService,
    checkSuggestedDoctors,
    checkSuggestedServices,
  };
});
