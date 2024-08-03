import { api } from "../boot/axios";

function getAct(payload) {
  return api.post("/clinics/akt-get", payload);
}

function getFields(payload) {
  return api.post("/clinics/akt-get-fields", payload);
}

function createAct(payload) {
  return api.post("/clinics/akt-create", payload);
}

function showActFields(id) {
  return api.get(`/clinics/akt-show/${id}`);
}

function getPdfAct(id) {
  return api.get(`/clinics/akt-pdf/${id}`, {
    responseType: "blob",
  });
}

function aktDelete(id, payload) {
  return api.post(`/clinics/akt-delete/${id}`, payload);
}

//statuses
function aktSent(id) {
  return api.post(`/clinics/akt-sent/${id}`);
}
function aktUpdate(id) {
  return api.post(`/clinics/akt-update/${id}`);
}

export default {
  getAct,
  getFields,
  aktDelete,
  createAct,

  showActFields,

  getPdfAct,
  aktSent,
  aktUpdate,
};
