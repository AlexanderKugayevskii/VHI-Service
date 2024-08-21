import { defineStore } from "pinia";
import { useI18n } from "vue-i18n";
import { useAppealStore } from "./appealStore";
import { ref, computed, watch } from "vue";
import ClientService from "src/services/ClientService";
import AppealService from "src/services/AppealService";
import { sortBy } from "lodash";
export const useClientTableStore = defineStore("clientTable", () => {
  const { t } = useI18n();

  const { isClinic } = useAppealStore();

  const statuses = computed(() => {
    return {
      0: t("statuses.new"),
      1: t("statuses.in_progress"),
      2: t("statuses.completed"),
    };
  });

  const columns = computed(() => [
    {
      name: "index",
      label: "№",
      field: "index",
      align: "left",
      sortable: true,
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
      sortable: true,
    },
    {
      name: "finishedDate",
      align: "left",
      label: "Дата завершения",
      field: "finishedDate",
      sortable: true,
    },
    {
      name: "appealStatus",
      align: "left",
      label: t("client_table.appeal_status"),
      field: "appealStatus",
      sortable: true,
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
      sortable: true,
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
    sortBy: "index",
    descending: true,
    rowsPerPage: 10,
    rowsNumber: 0,
    page: 1,
  });

  const loading = ref(true);
  const users = ref([]);
  const total = ref(0);

  function fetchClients(
    page = 1,
    limit = 10,
    search,
    queries,
    sortBy,
    orderBy
  ) {
    loading.value = true;
    ClientService.getClients(page, limit, search, queries, sortBy, orderBy)
      .then((response) => {
        users.value = response.data.data.data;
        total.value = response.data.data.total;

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
    const propsSortBy = props.pagination.sortBy;
    let orderBy = props.pagination.descending ? "desc" : "asc";
    let sortBy;

    if (propsSortBy === "index") {
      sortBy = "id";
    } else if (propsSortBy === "appealDate") {
      sortBy = "applied_date";
    } else if (propsSortBy === "finishedDate") {
      sortBy = "finished_date";
    } else if (propsSortBy === "appealStatus") {
      sortBy = "status";
    } else if (propsSortBy === "diagnosisName") {
      sortBy = "diagnosis";
    }

    fetchClients(
      props.pagination.page,
      props.pagination.rowsPerPage,
      props.filter,
      requestFilterQuery.value,
      sortBy,
      orderBy
    );

    pagination.value.descending = props.pagination.descending;
    pagination.value.sortBy = propsSortBy;
  };

  const rows = computed(() => {
    return users.value.map((row, index) => {
      const doctors = row.doctors.map((doctor) => doctor.name).join(", ");
      const services = row.services.map((service) => service.name).join(", ");
      const appliedDate = row.applied_date.split("-").reverse().join("-");
      const finishedDate = row.finished_date
        ? row.finished_date.split("-").reverse().join("-")
        : null;

      const totalAmount = row.doctors
        .concat(row.services)
        .reduce((prev, curr) => {
          return curr.pivot.status !== 2
            ? prev + curr.pivot.quantity * parseFloat(curr.pivot.price)
            : 0;
        }, 0);

      return {
        contractClientId: row.contract_client_id,
        appealId: row.id,
        clientFirstname: row.client.name,
        clientLastname: row.client.lastname,
        birthday: row.client.birthday,
        appealDate: appliedDate,
        finishedDate: finishedDate,
        appealStatus: row.status,
        clinicName: row.hospital.name,
        doctorName: doctors,
        serviceName: services,
        diagnosisName: row.diagnosis ?? "",
        expenseAmount: totalAmount ?? "",
        dmsCode: row.contract_client?.dms_code ?? "",
        program: row.contract_client?.program?.name ?? "",
        type_id: row.client_type,
        userSettings: "",
        // index:
        //   (pagination.value.page - 1) * pagination.value.rowsPerPage +
        //   index +
        //   1,
        index: row.id,
      };
    });
  });

  // fetch clinics for filter table clinic
  const clinics = ref([]);
  const fetchClinics = async () => {
    loading.value = true;
    try {
      const response = await AppealService.getClinics();
      clinics.value = response.data.data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  // filterQuery constructor
  const filterQuery = ref({});
  const filterData = computed(() => {
    return [
      {
        name: t("client_table.client"),
        type: "client",
        meta: true,
        placeholder: "Фамилия и имя клиента",
        multiple: false,
        component: "SimpleInput",
        item: "",
      },
      {
        name: t("client_table.date_of_appeal"),
        type: "date_of_appeal",
        meta: true,
        placeholder: "01.01.1990",
        multiple: false,
        component: "DateInput",
        item: "",
      },
      {
        name: t("client_table.appeal_status"),
        type: "appeal_status",
        meta: true,
        placeholder: "Выберите статус",
        multiple: false,
        component: "DropdownSelectNew",
        item: Object.keys(statuses.value).map((key) => ({
          status: Number(key),
          name: statuses.value[key],
        })),
      },
      {
        name: t("client_table.clinic"),
        type: "clinic",
        meta: !isClinic,
        placeholder: t("create_appeal.dropdowns.clinic"),
        multiple: false,
        component: "DropdownSelectNew",
        item: clinics.value.map(({ name, id }) => {
          return {
            name,
            id,
          };
        }),
      },
      {
        name: t("client_table.doctor"),
        type: "doctors",
        meta: true,
        placeholder: t("create_appeal.dropdowns.doctors"),
        multiple: true,
        component: "SimpleInput",
        // item: [
        //   ...new Set(
        //     users.value
        //       .flatMap((row) => row.doctors)
        //       .map((doctor) => doctor.name)
        //   ),
        // ],
        item: "",
      },
      {
        name: t("client_table.service"),
        type: "services",
        meta: true,
        placeholder: t("create_appeal.dropdowns.services"),
        multiple: true,
        component: "SimpleInput",

        item: "",
      },
    ];
  });

  // method for
  const selectFilterData = (option, type, multiple) => {
    let optionItem = option;
    if (!filterQuery.value[type]) {
      if (multiple) {
        filterQuery.value[type] = [];
        filterQuery.value[type].push(optionItem);
      } else {
        filterQuery.value[type] = optionItem;
      }
    } else {
      if (multiple) {
        const index = filterQuery.value[type].findIndex(
          (item) => item === optionItem
        );
        if (index > -1) {
          filterQuery.value[type].splice(index, 1);
        } else {
          filterQuery.value[type].push(optionItem);
        }
        if (filterQuery.value[type].length === 0) {
          delete filterQuery.value[type];
        }
      } else {
        if (
          filterQuery.value[type] === optionItem &&
          type !== "date_of_appeal"
        ) {
          delete filterQuery.value[type];
        } else {
          filterQuery.value[type] = optionItem;
        }
        if (filterQuery.value[type]?.length === 0) {
          delete filterQuery.value[type];
        }
      }
    }
  };

  const requestFilterQuery = computed(() => {
    const query = {
      full_name: filterQuery.value?.client,
      applied_date: filterQuery.value?.date_of_appeal,
      status: filterQuery.value.appeal_status?.status,
      hospital_id: filterQuery.value?.clinic?.id,
      doctors: filterQuery.value?.doctors,
      services: filterQuery.value?.services,
    };

    const entries = Object.entries(query);
    entries.forEach(([key, value]) => {
      if (value === undefined) {
        delete query[key];
      }
    });
    return query;
  });

  const checkSelectedOption = (option, type, multiple) => {
    if (multiple) {
      return filterQuery.value[type]?.some((item) => item === option);
    } else {
      if (type === "appeal_status") {
        return option.status === filterQuery.value[type]?.status;
      }
      return option === filterQuery.value[type];
    }
  };

  const removeFilter = (filterKey) => {
    delete filterQuery.value[filterKey];
  };

  return {
    loading,
    total,
    pagination,
    rows,
    columns,
    handleRequest,
    filterData,
    selectFilterData,
    filterQuery,
    checkSelectedOption,
    removeFilter,
    fetchClinics,
  };
});
