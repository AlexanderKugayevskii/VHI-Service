import { api } from "../boot/axios";

function getClients(page, limit, search, filterQueries) {
  return api.get(`/api`, {
    params: {
      _page: page,
      _limit: limit,
      q: search,
      ...filterQueries,
    },
  });
}

function getClientsBySearch(q = "") {
  return api.get(`/clients`, {
    params: {
      q: q,
    },
  });
}

function getClientByUserID(userID) {
  return api.get("/clients", {
    params: {
      userID: userID,
    },
  });
}

function getClientByPassport(passportSeries) {
  return api.get("/clients", {
    params: {
      passportSeries: encodeURIComponent(passportSeries),
    },
  });
}

function getClientByClientName(clientName) {
  return api.get("/clients", {
    params: {
      clientName: clientName,
    },
  });
}

export default {
  getClients,
  getClientsBySearch,

  getClientByUserID,
  getClientByPassport,
  getClientByClientName,
};
