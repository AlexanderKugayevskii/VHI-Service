import { defineStore } from "pinia";
import { reactive } from "vue";

export const useClientsStore = defineStore("clients", () => {
  const filterData = reactive({
    clientName: null,
    dateOfAppeal: null,
    status: null,
    clinicName: null,
    doctorName: null,
    serviceName: null,
  });

  // setters
  const setClientName = (value) => {
    filterData.clientName = value;
  };
  const setDateOfAppeal = (date) => {
    filterData.value = date ?? new Date();
  };
  const setStatus = (status) => {
    filterData.value = status;
  };
  const setClinicName = (clinicName) => {
    filterData.clinicName = clinicName;
  };
  const setDoctorName = (doctorName) => {
    filterData.doctorName = doctorName;
  };
  const setServiceName = (serviceName) => {
    filterData.serviceName = serviceName;
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
