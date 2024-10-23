import { defineStore } from "pinia";
import { ref, computed, onMounted, watch } from "vue";
import DrugsService from "src/services/DrugsService";
import AppealService from "src/services/AppealService";
import formatDate from "src/helpers/formatDate";

import { useI18n } from "vue-i18n";
export const useDrugTableStore = defineStore("drugTable", () => {
  const { t } = useI18n();
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
      name: "limits",
      align: "left",
      label: "лимиты",
      field: "limits",
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

  function fetchClients(
    page = 1,
    limit = 10,
    search,
    queries,
    sortBy,
    orderBy
  ) {
    loading.value = true;
    DrugsService.getClients(page, limit, search, queries, sortBy, orderBy)
      .then((response) => {
        users.value = response.data.data.data;

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
      const medicines = row.drugs.map((drug) => drug.name).join(", ");
      const appliedDate = row.applied_date.split("-").reverse().join("-");
      const finishedDate = row.finished_date
        ? row.finished_date.split("-").reverse().join("-")
        : null;

      const totalAmount = row.drugs.reduce((prev, curr) => {
        return prev + curr.pivot.quantity * parseFloat(curr.pivot.price);
      }, 0);

      const limitNames = [
        ...new Set([row.drugs_program_item_names].flat()),
      ].join(", ");

      return {
        contractClientId: row.contract_client_id,
        appealId: row.id,
        clientFirstname: row.client.name,
        clientLastname: row.client.lastname,
        birthday: row.client.birthday,
        appealDate: appliedDate,
        finishedDate: finishedDate,
        appealStatus: row.status,
        drugstore: row.drugstore.name ?? "",
        medicines: medicines,
        expenseAmount: totalAmount ?? "",
        dmsCode: row.contract_client.dms_code,
        program: row.contract_client.program?.name,
        type_id: row.client_type,
        specificType: row.contract_client.type,
        userSettings: "",
        index: row.id,
        limits: limitNames,
      };
    });
  });
  // index:
  //   (pagination.value.page - 1) * pagination.value.rowsPerPage +
  //   index +
  //   1,

  const drugstores = ref([]);
  const fetchDrugstores = async () => {
    try {
      const response = await AppealService.getDrugstores();
      drugstores.value = response.data.data;
    } catch (e) {
      console.error(e);
    } finally {
    }
  };

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
        name: "Аптека",
        type: "drugstore",
        meta: true,
        placeholder: "Аптека",
        multiple: false,
        component: "DropdownSelectNew",
        item: drugstores.value.map(({ name, id }) => {
          return {
            name,
            id,
          };
        }),
      },
      {
        name: "Лекарства",
        type: "drugs",
        meta: true,
        placeholder: "Введите названия лекарства",
        multiple: true,
        component: "SimpleInput",
        item: "",
      },
    ];
  });

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
      drugstore_id: filterQuery.value?.drugstore?.id,
      drugs: filterQuery.value?.drugs,
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
    pagination,
    loading,
    rows,
    columns,
    handleRequest,
    drugstores,
    fetchDrugstores,
    selectFilterData,
    filterData,
    filterQuery,
    requestFilterQuery,
    checkSelectedOption,
    removeFilter,
  };
});
