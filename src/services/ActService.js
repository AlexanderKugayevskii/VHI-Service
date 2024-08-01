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

export default {
  getAct,
  getFields,
  createAct,
};
