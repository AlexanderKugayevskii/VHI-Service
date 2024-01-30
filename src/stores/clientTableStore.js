import { defineStore } from "pinia";
import { ref, computed } from "vue";
import ClientService from "src/services/ClientService";
export const useClientTableStore = defineStore("clientTable", () => {
  const pagination = ref({
    sortBy: "desc",
    descending: false,
    rowsPerPage: 10,
    rowsNumber: 0,
    page: 1,
  });

  const loading = ref(true);
  const users = ref([]);

  function fetchClients(page = 1, limit = 10, search) {
    loading.value = true;
    ClientService.getClients(page, limit, search)
      .then((response) => {
        users.value = response.data;
        // router.push({
        //   name: "appeals-page",
        //   query: {
        //     page,
        //     limit,
        //   },
        // });

        pagination.value.page = page;
        pagination.value.rowsPerPage = limit;
        pagination.value.rowsNumber = parseInt(
          response.headers.get("x-total-count")
        );
      })
      .catch(() => {})
      .finally(() => {
        loading.value = false;
      });
  }

  const handleRequest = (props) => {
    fetchClients(
      props.pagination.page,
      props.pagination.rowsPerPage,
      props.filter
    );
  };

  return { pagination, loading, users, handleRequest };
});
