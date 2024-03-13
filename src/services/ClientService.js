import { api } from "../boot/axios";

function getClients(page, limit, search, filterQueries) {
  return api.get(`/clinics/applications`, {
    params: {
      _limit: limit,
      page: page,
      q: search,
      ...filterQueries,
    },
  });
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
  getClientByAppealId,

  getClientsByCode,
  getClientsByName,
  getClientsByPassport,
};
