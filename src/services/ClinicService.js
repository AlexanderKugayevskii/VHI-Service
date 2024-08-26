import { api } from "../boot/axios";

function getClinics() {
  return api.get("/clinics");
}

function getDoctors(id) {
  return api.get(`/clinics/doctors/${id}`);
}

function getServices(id) {
  return api.get(`/clinics/${id}/services`);
}

function downloadOrganizationsExcel(dateRange, organizationId) {
  return api.post(
    `/clinics/organizations-excel/${organizationId}`,
    {
      ...dateRange,
    },
    { responseType: "blob" }
  );
}

function fetchOrganizations() {
  return api.get("/clinics/organizations-list");
}

export default {
  getClinics,
  getDoctors,
  getServices,

  downloadOrganizationsExcel,
  fetchOrganizations,
};
