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

function getDrugstores() {
  return api.get("/clinics/drugstores");
}

function saveAppealByAgent(payload) {
  return api.post("/clinics/applications", payload);
}
function saveAppealByClinic(payload) {
  return api.post("/clinics/application-clinic", payload);
}

function saveDrugAppeal(payload) {
  return api.post("/clinics/applications", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function changeAppealData(appealId, payload) {
  return api.post(`/clinics/applications/${appealId}`, payload);
}

function changeAppealDrugData(appealId, payload) {
  return api.post(`/clinics/applications/${appealId}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

function deleteAppeal(appealId) {
  return api.delete(`/clinics/applications/${appealId}`);
}

export default {
  getDrugs,
  getDrugstores,
  getClinics,
  getDoctors,
  getServices,
  getHospitalDataById,
  saveAppealByAgent,
  saveAppealByClinic,
  changeAppealData,
  saveDrugAppeal,
  changeAppealDrugData,
  deleteAppeal,
};
