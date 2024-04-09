import { defineStore } from "pinia";
import { ref, computed, onMounted, watch } from "vue";
import ClientService from "src/services/ClientService";
import formatDate from "src/helpers/formatDate";

import { useI18n } from "vue-i18n";
export const useFullClientTableStore = defineStore("allClientTable", () => {
  const { t } = useI18n();

  const columns = computed(() => [
    {
      name: "index",
      label: "№",
      field: "index",
      align: "left",
    },
    {
      name: "clientName",
      align: "left",
      label: t("client_table.clients"),
      field: "clientName",
    },
    {
      name: "clientType",
      align: "left",
      label: "Тип",
      field: "clientType",
    },
    {
      name: "passport",
      align: "left",
      label: "Паспорт",
      field: "passport",
    },
    {
      name: "dmsId",
      align: "left",
      label: "ID",
      field: "dmsId",
    },
    {
      name: "program",
      align: "left",
      label: "Программа",
      field: "program",
    },
    {
      name: "insurancePeriod",
      align: "left",
      label: "Период страхования",
      field: "insurancePeriod",
    },
    {
      name: "organizationName",
      align: "left",
      label: "Организация",
      field: "organizationName",
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
    ClientService.getFullClients(page, limit, search)
      .then((response) => {
        users.value = response.data.data.data;
        console.log(users.value);

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
    users.value.forEach((row) => {
      console.log(row);
    });
    return users.value.map((row, index) => {
      const insurancePeriod =
        row.contract.start_date.replace(/-/g, ".") +
        " - " +
        row.contract.end_date.replace(/-/g, ".");

      return {
        contractClientId: row.contract_client_id,
        appealId: row.id,
        clientFirstname: row.contract.contract_client[0].client.name,
        clientLastname: row.contract.contract_client[0].client.lastname,
        clientType: "Клиент",
        passport: `${row.contract.contract_client[0].client.seria} ${row.contract.contract_client[0].client.number}`,
        dmsId: row.contract.contract_client[0].dms_code,
        program: row.contract.contract_client[0].program.name,
        insurancePeriod: insurancePeriod,
        index: row.id,
      };
    });
  });

  return { pagination, loading, rows, columns, handleRequest };
});
