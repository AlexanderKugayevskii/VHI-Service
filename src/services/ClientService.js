import { api } from '../boot/axios';

function getClients(page, limit, search) {
  return api.get(`/api`, {
    params: {
      _page: page,
      _limit: limit,
      q: search,
    },
  });
}

function getClientsBySearch(q = '') {
  return api.get(`/clients`, {
    params: {
      q: q,
    },
  });
}

export default {
  getClients,
  getClientsBySearch,
};
