import { api } from "../boot/axios";

function getClinics() {
  return api.get("/clinics");
}

function getDoctors(id) {
  console.log(id);
  return api.get(`/clinics/${id}/doctors`);
}

export default {
  getClinics,
  getDoctors,
};
