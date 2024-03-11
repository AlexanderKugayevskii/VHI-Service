import { api } from "../boot/axios";

function getClinics() {
  return api.get("/clinics/hospitals");
}

export default {
  getClinics,
};
