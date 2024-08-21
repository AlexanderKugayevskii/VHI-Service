import { api } from "../boot/axios";

function getClients(page, limit, search, filterQueries, sortBy, orderBy) {
  return api.get(`/clinics/application-drugstores`, {
    params: {
      _limit: limit,
      page: page,
      sortBy: sortBy,
      orderBy: orderBy,
      all_fields: search,
      ...filterQueries,
    },
  });
}

export default {
  getClients,
};
