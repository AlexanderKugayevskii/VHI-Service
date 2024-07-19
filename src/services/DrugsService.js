import { api } from "../boot/axios";

function getClients(page, limit, search, filterQueries) {
  return api.get(`/clinics/application-drugstores`, {
    params: {
      _limit: limit,
      page: page,
      all_fields: search,
      ...filterQueries,
    },
  });
}

export default {
  getClients,
};
