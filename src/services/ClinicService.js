import { api } from "../boot/axios";

function getClinics() {
  return api.get("/clinics");
}

function getDoctors(id) {
  return api.get(`/clinics/doctors/${id}`);
}

function getServices(id) {
  return api.get(`/clinics/${id}/services`);
}

function downloadClinicExcel(dateRange) {
  return api.post(
    `/clinics/organizations-excel`,
    {
      ...dateRange,
    },
    { responseType: "blob" }
  );
}

export default {
  getClinics,
  getDoctors,
  getServices,

  downloadClinicExcel,
};
