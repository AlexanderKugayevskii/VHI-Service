import { api } from "../boot/axios";

function getAct(payload) {
  return api.post("/clinics/akt-get", payload);
}

export default {
  getAct,
};
