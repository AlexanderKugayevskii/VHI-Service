import { api } from "../boot/axios";

function getClients(page, limit, search) {
  return api.get(`/api`, {
    params: {
      _page: page,
      _limit: limit,
      q: search,
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
  console.log(userID);
  return api.get("/clients", {
    params: {
      userID: userID,
    },
  });
}

function getClientByPassport(passportSeries) {
  return api.get("/clients", {
    params: {
      passportSeries: passportSeries,
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
