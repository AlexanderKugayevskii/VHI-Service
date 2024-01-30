import { defineStore } from "pinia";
import { reactive } from "vue";

export const useClientsStore = defineStore("clients", () => {
  const filterData = reactive({
    clientName: {
      label: "Клиент",
      value: null,
    },
    dateOfAppeal: {
      label: "Дата обращения",
      value: null,
    },
    status: {
      label: "Статус",
      value: null,
    },
    clinicName: {
      label: "Клиника",
      value: null,
    },
    doctorName: {
      label: "Врач",
      value: null,
    },
    serviceName: {
      label: "Сервис",
      value: null,
    },
  });

  // setters
  const setClientName = (value) => {
    filterData.clientName.value = value;
  };
  const setDateOfAppeal = (date) => {
    filterData.dateOfAppeal.value = date ?? new Date();
  };
  const setStatus = (status) => {
    filterData.status.value = status;
  };
  const setClinicName = (clinicName) => {
    filterData.clinicName.value = clinicName;
  };
  const setDoctorName = (doctorName) => {
    filterData.doctorName.value = doctorName;
  };
  const setServiceName = (serviceName) => {
    filterData.serviceName.value = serviceName;
  };

  return {
    filterData,
    setClientName,
    setDateOfAppeal,
    setStatus,
    setClinicName,
    setDoctorName,
    setServiceName,
  };
});
