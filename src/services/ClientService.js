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
      q: search,
      ...filterQueries,
    },
  });
}

function getClientInfo(id) {
  return api.get(`/clinics/clients/${id}`);
}

function getClientByAppealId(appealId) {
  return api.get(`/clinics/applications/${appealId}`);
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

  getClientsByCode,
  getClientsByName,
  getClientsByPassport,
};
