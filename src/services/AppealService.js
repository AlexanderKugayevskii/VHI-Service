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

function getHospitalDataById(id) {
  return api.get(`/clinics/hospitals/${id}`);
}

function saveAppealByAgent(payload) {
  return api.post("/clinics/application-agent", payload);
}

export default {
  getClinics,
  getDoctors,
  getServices,
  getHospitalDataById,
  saveAppealByAgent,
};
