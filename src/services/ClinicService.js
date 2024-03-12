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

export default {
  getClinics,
  getDoctors,
  getServices,
};
