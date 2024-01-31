import { api } from "../boot/axios";

function getClinics(search) {
  return api.get("/clinics", {
    params: {
      q: search.toLowerCase(),
    },
  });
}

function getDoctors(id, search) {
  return api.get(`/clinics/${id}/doctors`, {
    params: {
      q: search,
    },
  });
}

export default {
  getClinics,
  getDoctors,
};
