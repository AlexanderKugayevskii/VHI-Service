import { api } from "../boot/axios";

function getClinics() {
  return api.get("/clinics/hospitals");
}

function getDoctors(id) {
  return api.get(`/clinics/doctors/${id}`);
}


function getServices(id) {
  return api.get(`/clinics/services/${id}`);
}

export default {
  getClinics,
  getDoctors,
  getServices
};
