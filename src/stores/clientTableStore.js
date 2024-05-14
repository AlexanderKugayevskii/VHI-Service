import { defineStore } from "pinia";
import { ref, computed, onMounted, watch } from "vue";
import ClientService from "src/services/ClientService";
import formatDate from "src/helpers/formatDate";
import { useI18n } from "vue-i18n";
export const useClientTableStore = defineStore("clientTable", () => {
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
      const appliedDate = row.applied_date.split("-").reverse().join("-");
      return {
        contractClientId: row.contract_client_id,
        appealId: row.id,
        clientFirstname: row.client.name,
        clientLastname: row.client.lastname,
        appealDate: appliedDate,
        appealStatus: row.status,
        clinicName: row.hospital.name,
        doctorName: doctors,
        serviceName: services,
        diagnosisName: row.diagnosis ?? "",
        expenseAmount: row.total_amount ?? "",
        dmsCode: row.contract_client?.dms_code ?? "",
        program: row.contract_client?.program?.name ?? "",
        userSettings: "",
        // index:
        //   (pagination.value.page - 1) * pagination.value.rowsPerPage +
        //   index +
        //   1,
        index: row.id,
      };
    });
  });

  
  const filterQuery = ref({});
  const filterData = computed(() => {
    return [
      {
        name: t("client_table.client"),
        type: "client",
        placeholder: "Фамилия и имя клиента",
        multiple: false,
        item: [
          ...new Set(
            users.value.map((row) => {
              return row.client.lastname + " " + row.client.name;
            })
          ),
        ],
      },
      {
        name: t("client_table.date_of_appeal"),
        type: "date_of_appeal",
        placeholder: "01.01.1990",
        multiple: false,
        item: [
          ...new Set(
            users.value.map((row) =>
              formatDate(row.created_at, { withHours: false })
            )
          ),
        ],
      },
      {
        name: t("client_table.appeal_status"),
        type: "appeal_status",
        placeholder: "Выберите статус",
        multiple: false,
        item: users.value
          .map((row) => {
            return {
              status: row.status,
              name: statuses.value[row.status],
            };
          })
          .filter((statusItem, index, thisArr) => {
            return (
              index === thisArr.findIndex((t) => t.status === statusItem.status)
            );
          }),
      },
      {
        name: t("client_table.clinic"),
        type: "clinic",
        placeholder: t("create_appeal.dropdowns.clinic"),
        multiple: false,
        item: [...new Set(users.value.map((row) => row.hospital.name))],
      },
      {
        name: t("client_table.doctor"),
        type: "doctors",
        placeholder: t("create_appeal.dropdowns.doctors"),
        multiple: true,
        item: [
          ...new Set(
            users.value
              .flatMap((row) => row.doctors)
              .map((doctor) => doctor.name)
          ),
        ],
      },
      {
        name: t("client_table.service"),
        type: "services",
        placeholder: t("create_appeal.dropdowns.services"),
        multiple: true,
        item: [
          ...new Set(
            users.value
              .flatMap((row) => row.services)
              .map((service) => service.name)
          ),
        ],
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
      } else {
        filterQuery.value[type] = optionItem;
      }
    }

    console.log(filterQuery.value);
  };

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

  watch(
    () => users.value,
    (newUsers) => {
      console.log(filterData.value);
      console.log(`filterQuery`, filterQuery.value);
    }
  );

  return {
    pagination,
    loading,
    rows,
    columns,
    handleRequest,
    filterData,
    selectFilterData,
    filterQuery,
    checkSelectedOption,
    removeFilter
  };
});
