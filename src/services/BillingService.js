import { api } from "../boot/axios";

function getClinicsBilling() {
  return api.get("/clinics/hospitals/billing");
}

export default {
    getClinicsBilling,
};
