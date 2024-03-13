import { api } from "../boot/axios";

function getClients(page, limit, search, filterQueries) {
  console.log("page", page);
  console.log("limit", limit);
  return api.get(`/clinics/applications`, {
    params: {
      limit: limit,
      page: page,
      q: search,
      ...filterQueries,
    },
  });
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

  getClientsByCode,
  getClientsByName,
  getClientsByPassport,
};
