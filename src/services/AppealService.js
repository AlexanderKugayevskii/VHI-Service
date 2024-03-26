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

function getDrugs(name) {
  return api.get("/clinics/search-drugs", {
    params: {
      name,
    },
  });
}

function saveAppealByAgent(payload) {
  return api.post("/clinics/applications", payload);
}
function saveAppealByClinic(payload) {
  return api.post("/clinics/application-clinic", payload);
}
function changeAppealData(appealId, payload) {
  return api.put(`/clinics/applications/${appealId}`, payload);
}

export default {
  getDrugs,
  getClinics,
  getDoctors,
  getServices,
  getHospitalDataById,
  saveAppealByAgent,
  saveAppealByClinic,
  changeAppealData,
};
