import { defineStore } from "pinia";
import { ref, computed, onMounted, watch } from "vue";
import DrugsService from "src/services/DrugsService";
import formatDate from "src/helpers/formatDate";

import { useI18n } from "vue-i18n";
export const useDrugTableStore = defineStore("drugTable", () => {
  const { t } = useI18n();

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
      label: t("client_table.clients"),
      field: "clientName",
    },
    {
      name: "appealDate",
      align: "left",
      label: t("client_table.date_of_appeal"),
      field: "appealDate",
    },
    {
      name: "appealStatus",
      align: "left",
      label: t("client_table.appeal_status"),
      field: "appealStatus",
    },
    {
      name: "drugstore",
      align: "left",
      label: t("client_table.drugstore"),
      field: "drugstore",
    },
    {
      name: "medicines",
      align: "left",
      label: "Лекарства",
      field: "medicines",
    },
    {
      name: "expenseAmount",
      align: "right",
      label: t("client_table.expense", { currency: "UZS" }),
      field: "expenseAmount",
    },
    {
      name: "userSettings",
      align: "left",
    },
  ]);

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
    DrugsService.getClients(page, limit, search)
      .then((response) => {
        users.value = response.data.data.data;
        // router.push({
        //   name: "appeals-page",
        //   query: {
        //     page,
        //     limit,
        //   },
        // });

        pagination.value.page = page;
        pagination.value.rowsPerPage = limit;
        pagination.value.rowsNumber = response.data.data.total;
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
      const medicines = row.drugs.map((drug) => drug.name).join(", ");

      return {
        contractClientId: row.contract_client_id,
        appealId: row.id,
        clientFirstname: row.client.name,
        clientLastname: row.client.lastname,
        appealDate: formatDate(row.created_at),
        appealStatus: row.status,
        drugstore: row.drugstore.name ?? "",
        medicines: medicines,
        expenseAmount: row.total_amount ?? "",
        dmsCode: row.contract_client.dms_code,
        program: row.contract_client.program?.name,
        userSettings: "",
        index: row.id,
      };
    });
  });
  // index:
  //   (pagination.value.page - 1) * pagination.value.rowsPerPage +
  //   index +
  //   1,

  return { pagination, loading, rows, columns, handleRequest };
});
