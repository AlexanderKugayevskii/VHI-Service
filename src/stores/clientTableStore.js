import { defineStore } from "pinia";
import { ref, computed, onMounted, watch } from "vue";
import ClientService from "src/services/ClientService";
import formatDate from "src/helpers/formatDate";

import { useI18n } from "vue-i18n";
export const useClientTableStore = defineStore("clientTable", () => {
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
      name: "clinicName",
      align: "left",
      label: t("client_table.clinic"),
      field: "clinicName",
    },
    {
      name: "doctorName",
      align: "left",
      label: t("client_table.doctor"),
      field: "doctorName",
    },
    {
      name: "serviceName",
      align: "left",
      label: t("client_table.service"),
      field: "serviceName",
    },
    {
      name: "diagnosisName",
      align: "left",
      label: t("client_table.diagnosis"),
      field: "diagnosisName",
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
    ClientService.getClients(page, limit, search)
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
      
      const doctors = row.doctors.map((doctor) => doctor.name).join(", ");
      const services = row.services.map((service) => service.name).join(", ");
      return {
        contractClientId: row.contract_client_id,
        appealId: row.id,
        clientFirstname: row.client.name,
        clientLastname: row.client.lastname,
        appealDate: formatDate(row.created_at),
        appealStatus: row.status,
        clinicName: row.hospital.name,
        doctorName: doctors,
        serviceName: services,
        diagnosisName: row.diagnosis ?? "",
        expenseAmount: row.total_amount ?? "",
        dmsCode: row.contract_client.dms_code,
        program: row.contract_client.program?.name,
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
