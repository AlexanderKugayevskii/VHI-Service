import { defineStore } from "pinia";
import { ref, computed, onMounted, watch } from "vue";
import ClientService from "src/services/ClientService";
import formatNumber from "src/helpers/formatNumber";
import { useI18n } from "vue-i18n";
import { Loading } from "quasar";

export const useFullClientTableStore = defineStore("allClientTable", () => {
  const { t } = useI18n();

  // allTable
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
      name: "pinfl",
      align: "left",
      label: "ПИНФЛ",
      field: "passport",
    },
    {
      name: "phone",
      align: "left",
      label: "Телефон",
      field: "phone",
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
      const insurancePeriod =
        row.contract.start_date.replace(/-/g, ".") +
        " - " +
        row.contract.end_date.replace(/-/g, ".");

      return {
        contractClientId: row.id,
        clientFirstname: row.client.name,
        clientLastname: row.client.lastname,
        passport: `${row.client.seria} ${row.client.number}`,
        pinfl: row.client.pinfl,
        phone: formatNumber(row.client.phone),
        clientType: "Клиент",
        dmsId: row.dms_code,
        program: row.program?.name ?? "",
        insurancePeriod: insurancePeriod,
        organizationName: row.contract?.applicant ?? "no applicant",
        index: row.id,
      };
    });
  });

  const clientInfo = ref(null);
  const setClientInfo = (item) => {
    clientInfo.value = item;
  };

  const getClientInfo = async (id) => {
    loading.value = true;
    try {
      const response = await ClientService.getClientInfo(id);
      const data = response.data.data;
      setClientInfo(data);
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  return {
    pagination,
    loading,
    rows,
    columns,
    handleRequest,
    clientInfo,
    getClientInfo,
  };
});
