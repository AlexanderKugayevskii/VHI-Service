import { api } from "../boot/axios";

//appeals clients
function getClients(page, limit, search, filterQueries) {
  return api.get(`/clinics/application-hospitals`, {
    params: {
      _limit: limit,
      page: page,
      all_fields: search,
      ...filterQueries,
    },
  });
}

//full clients
function getFullClients(page, limit, search, filterQueries) {
  return api.get("/clinics/clients", {
    params: {
      _limit: limit,
      page: page,
      all_fields: search,
      ...filterQueries,
    },
  });
}

function getClientExcelData(contract_client_id) {
  return api.get(`/clinics/client-excel/${contract_client_id}`, {
    responseType: "blob",
  });
}

function getClinicExcelData(clinic_id) {
  return api.get(`/clinics/hospital-excel/${clinic_id}`);
}

function getClientInfo(id) {
  return api.get(`/clinics/clients/${id}`);
}

function getClientByAppealId(appealId) {
  return api.get(`/clinics/applications/${appealId}`);
}

function getMedicalPrograms(id) {
  return api.get(`/clinics/limits/${id}`);
}

function getClientsByCode(code) {
  return api.get("/clinics/search-by-code", {
    params: {
      dms_code: code,
    },
  });
}

function getClientsByName(name) {
  return api.get("/clinics/search-by-name", {
    params: {
      full_name: name,
    },
  });
}

function getClientsByPassport(passport) {
  return api.get("/clinics/search-by-passport", {
    params: {
      passport: passport,
    },
  });
}

export default {
  getClients,
  getFullClients,
  getClientInfo,
  getClientByAppealId,
  getMedicalPrograms,
  getClientsByCode,
  getClientsByName,
  getClientsByPassport,
  getClientExcelData,
  getClinicExcelData,
};
