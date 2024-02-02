import { defineStore } from "pinia";
import { ref, computed } from "vue";
import ClientService from "src/services/ClientService";
import { i18n } from "src/i18n";
const columns = computed(() => [
  {
    name: "index",
    label: "№",
    field: "index",
    align: "left",
  },
  {
    name: "client",
    align: "left",
    label: i18n.t("client_table.clients"),
    field: "clientName",
  },
  {
    name: "appealDate",
    align: "left",
    label: i18n.t("client_table.date_of_appeal"),
    field: "appealDate",
  },
  {
    name: "appealStatus",
    align: "left",
    label: i18n.t("client_table.appeal_status"),
    field: "appealStatus",
  },
  {
    name: "clinicName",
    align: "left",
    label: i18n.t("client_table.clinic"),
    field: "clinicName",
  },
  {
    name: "doctorName",
    align: "left",
    label: i18n.t("client_table.doctor"),
    field: "doctorName",
  },
  {
    name: "serviceName",
    align: "left",
    label: i18n.t("client_table.service"),
    field: "serviceName",
  },
  {
    name: "diagnosisName",
    align: "left",
    label: i18n.t("client_table.diagnosis"),
    field: "diagnosisName",
  },
  {
    name: "expenseAmount",
    align: "right",
    label: i18n.t("client_table.expense", { currency: "UZS" }),
    field: "expenseAmount",
  },
  {
    name: "userSettings",
    align: "left",
  },
]);
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

  const rows = computed(() => {
    return users.value.map((row, index) => {
      return {
        ...row,
        userSettings: "",
        index:
          (pagination.value.page - 1) * pagination.value.rowsPerPage +
          index +
          1,
      };
    });
  });
  return { pagination, loading, rows, columns, handleRequest };
});
