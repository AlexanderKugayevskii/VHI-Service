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

function updateClientData(id, payload) {
  return api.post(`/clinics/clients/update/${id}`, payload);
}

function getClientExcelData(contract_client_id) {
  return api.get(`/clinics/client-excel/${contract_client_id}`, {
    responseType: "blob",
  });
}

function getClinicExcelData(clinic_ids, dateRange) {
  return api.post(
    `/clinics/hospital-excel`,
    {
      ...dateRange,
      ids: clinic_ids,
    },
    {
      responseType: "blob",
    }
  );
}

function getDrugstoreExcelData(drugstore_ids, dateRange) {
  return api.post(
    `/clinics/drugstore-excel`,
    {
      ...dateRange,
      ids: drugstore_ids,
    },
    {
      responseType: "blob",
    }
  );
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
  getDrugstoreExcelData,
  updateClientData,
};
