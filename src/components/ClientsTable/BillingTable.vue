<template>
  <div>
    <div>
      <!-- v-model:pagination="pagination" -->
      <q-table
      
        flat
        :rows="billingData"
        :columns="columns"
        :loading="loading"
        hide-pagination
        v-model:pagination="pagination"
        ref="tableRef"
        row-key="index"
        no-data-label="I didn't find anything for you"
        no-results-label="The filter didn't uncover any results"
        @request="handleRequest"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center text-accent q-gutter-sm">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span> Well this is sad... {{ message }} </span>
            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          </div>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              :class="[
                { 'text-right': col.name === 'payAmount' },
                'appeals-th',
              ]"
            >
              <template v-if="col.name === 'checkbox'">
                <SimpleCheckbox
                  square
                  @change="handleAllBillings"
                  :checked="checkAllBillings"
                />
              </template>
              <template v-else>
                {{ col.label }}
              </template>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" class="clickable">
            <q-td key="checkbox" :props="props" class="appeals-td">
              <SimpleCheckbox
                square
                :item="props.row"
                @change="handleCheck"
                :checked="checkBil(props.row)"
              />
              <!-- :checked="checkDrug(props.row)" -->
            </q-td>
            <q-td key="agent" :props="props" class="appeals-td">
              {{ props.row.agent }}
            </q-td>

            <q-td key="date" :props="props" class="appeals-td">
              <a
                class="appeal-link"
                @click="() => (props.row.expandTable = !props.row.expandTable)"
                >{{ props.row.date }}
                <q-icon size="20px">
                  <svg
                    :class="[{ rotate: props.row.expandTable }]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#7A88A6"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg> </q-icon
              ></a>
            </q-td>
            <q-td key="appealsAmount" :props="props" class="appeals-td">
              {{ props.row.appealsAmount }}
            </q-td>
            <q-td key="invoice" :props="props" class="appeals-td">
              <!-- <StatusSwitcher :progress="props.row.invoice" /> -->
            </q-td>
            <q-td key="completionCertificate" :props="props" class="appeals-td">
              <!-- <StatusSwitcher :progress="props.row.completionCertificate" /> -->
            </q-td>

            <q-td key="payAmount" :props="props" class="text-right appeals-td">
              {{ formatPrice(props.row.payAmount, false) }}
            </q-td>
          </q-tr>
          <q-tr
            :props="props"
            :style="{
              height: props.row.expandTable ? 'inherit' : 0,
            }"
          >
            <q-td
              class="inner-table-td"
              key="inner-table"
              colspan="7"
              :style="{
                'border-bottom-width': props.row.expandTable ? 'inherit' : 0,
              }"
            >
              <Collapse :when="props.row.expandTable" class="v-collapse">
                <AppealsTable
                  :showPagination="false"
                  :showTableActions="false"
                  :rows="props.row.applications"
                  :columns="columnsAppeal"
                />
              </Collapse>
              <!-- hello -->
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>

    <div class="flex q-my-lg">
      <PaginationTable
        :pagination="pagination"
        :total="total"
        @onIncrementPage="incrementPage"
        @onDecrementPage="decrementPage"
        @onChangePage="changePage"
      />

      <q-space></q-space>
      <RowsPerPage
        @choiceOption="selectOption"
        :pagination="pagination"
        :total="total"
      />
    </div>
  </div>
</template>

<script setup>
import formatPrice from "src/helpers/formatPrice";
import ClientService from "src/services/ClientService";
import PaginationTable from "./PaginationTable.vue";
import RowsPerPage from "./RowsPerPage.vue";
import { onMounted, computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";
import SimpleCheckbox from "../Shared/SimpleCheckbox.vue";
import AppealsTable from "./AppealsTable.vue";
import { Collapse } from "vue-collapsed";
import StatusSwitcher from "../Shared/StatusSwitcher.vue";
import BillingService from "src/services/BillingService";
import useDay from "src/composables/useDay";

const { t } = useI18n();
const day = useDay();

const columnsAppeal = computed(() => [
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

const loading = ref(false);
const billingData = ref([
  // {
  //   index: 1,
  //   agent: "Profmed",
  //   date: "Июль 2024",
  //   appealsAmount: "25",
  //   invoice: 1,
  //   completionCertificate: 1,
  //   payAmount: "13 100 000",
  //   expandTable: false,
  //   applications: [
  //     {
  //       contractClientId: "1",
  //       appealId: "500",
  //       clientFirstname: "ivan",
  //       clientLastname: "ivanov",
  //       appealDate: "24/07/2024",
  //       appealStatus: 1,
  //       clinicName: "promed",
  //       doctorName: "окулист, терапевт",
  //       serviceName: "узи",
  //       diagnosisName: "разрыв жопы" ?? "",
  //       expenseAmount: null ?? "",
  //       dmsCode: null ?? "",
  //       program: "comfort",
  //       userSettings: "",
  //       index: "1",
  //     },
  //     {
  //       contractClientId: "1",
  //       appealId: "500",
  //       clientFirstname: "ivan",
  //       clientLastname: "ivanov",
  //       appealDate: "24/07/2024",
  //       appealStatus: 1,
  //       clinicName: "promed",
  //       doctorName: "окулист, терапевт",
  //       serviceName: "узи",
  //       diagnosisName: "разрыв жопы" ?? "",
  //       expenseAmount: null ?? "",
  //       dmsCode: null ?? "",
  //       program: "comfort",
  //       userSettings: "",
  //       index: "1",
  //     },
  //   ],
  // },
  // {
  //   index: 2,
  //   agent: "Profmed",
  //   date: "Июль 2024",
  //   appealsAmount: "25",
  //   invoice: 1,
  //   completionCertificate: 1,
  //   payAmount: "13 100 000",
  //   expandTable: false,
  //   applications: [
  //     {
  //       contractClientId: "1",
  //       appealId: "500",
  //       clientFirstname: "ivan",
  //       clientLastname: "ivanov",
  //       appealDate: "24/07/2024",
  //       appealStatus: 1,
  //       clinicName: "promed",
  //       doctorName: "окулист, терапевт",
  //       serviceName: "узи",
  //       diagnosisName: "разрыв жопы" ?? "",
  //       expenseAmount: null ?? "",
  //       dmsCode: null ?? "",
  //       program: "comfort",
  //       userSettings: "",
  //       index: "1",
  //     },
  //   ],
  // },
  // {
  //   index: 3,
  //   agent: "Profmed",
  //   date: "Июль 2024",
  //   appealsAmount: "25",
  //   invoice: 1,
  //   completionCertificate: 1,
  //   payAmount: "13 100 000",
  //   expandTable: false,
  //   applications: [
  //     {
  //       contractClientId: "1",
  //       appealId: "500",
  //       clientFirstname: "ivan",
  //       clientLastname: "ivanov",
  //       appealDate: "24/07/2024",
  //       appealStatus: 2,
  //       clinicName: "promed",
  //       doctorName: "окулист, терапевт",
  //       serviceName: "узи",
  //       diagnosisName: "разрыв жопы" ?? "",
  //       expenseAmount: null ?? "",
  //       dmsCode: null ?? "",
  //       program: "comfort",
  //       userSettings: "",
  //       index: "1",
  //     },
  //   ],
  // },
]);
const checkedBillings = ref([]);
const total = ref(0);
const tableRef = ref(null);
const searchData = ref("");

const pagination = ref({
  sortBy: "desc",
  descending: false,
  rowsPerPage: 10,
  page: 1,
});

const dateRangeData = ref(null);

const handleDateRange = (rangeData) => {
  dateRangeData.value = rangeData;
};
const disableButton = computed(() => {
  return dateRangeData.value === null || dateRangeData.value.checkActiveButton;
});

const fetchBillings = async () => {
  loading.value = true;
  try {
    const response = await BillingService.getClinicsBilling();
    const data = response.data.data;
    total.value = data.length;
    billingData.value = data.map((row) => {
      const monthName = dayjs()
        .month(row.month)
        .locale(day.currentLocale.value)
        .format("MMMM");
      console.log(day.currentLocale.value);
      console.log();
      return {
        agent: row.hospital_name,
        date: `${monthName}, ${row.year}`,
        appealsAmount: row.count,
        invoice: 1,
        completionCertificate: 1,
        payAmount: row.total_amount,
        expandTable: false,
        applications: row.applications.map((application) => {
          const doctors = application.doctors
            .map((doctor) => doctor.name)
            .join(", ");
          const services = application.services
            .map((service) => service.name)
            .join(", ");
          const appliedDate = application.applied_date
            .split("-")
            .reverse()
            .join("-");
          const finishedDate = application.finished_date
            ? application.finished_date.split("-").reverse().join("-")
            : null;

          return {
            contractClientId: application.contract_client_id,
            appealId: application.id,
            clientFirstname: application.client_name,
            clientLastname: application.client_lastname,
            appealDate: appliedDate,
            finishedDate: finishedDate,
            appealStatus: application.status,
            clinicName: application.hospital_name,
            doctorName: doctors,
            serviceName: services,
            diagnosisName: application.diagnosis ?? "",
            expenseAmount: application.total_amount ?? "",
            dmsCode: application.contract_client?.dms_code ?? "",
            program: application.contract_client?.program?.name ?? "",
            userSettings: "",

            index: row.id,
          };
        }),
      };
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

//  BILLING TABLE
const columns = computed(() => [
  {
    name: "checkbox",
    label: "",
    field: "checkbox",
    align: "left",
  },
  {
    name: "agent",
    label: "Агент",
    field: "agent",
    align: "left",
  },

  {
    name: "date",
    label: "Дата",
    align: "left",
    field: "date",
  },
  {
    name: "appealsAmount",
    align: "left",
    label: "Обращений",
    field: "appealsAmount",
  },
  {
    name: "invoice",
    align: "left",
    label: "Счет фактура",
    field: "invoice",
  },
  {
    name: "completionCertificate",
    align: "left",
    label: "Акт выполненных работ",
    field: "completionCertificate",
  },
  {
    name: "payAmount",
    align: "left",
    label: "Сумма на оплату",
    field: "payAmount",
  },
]);
const rows = computed(() => {
  return billingData.value;
});

// const filteredRows = computed(() => {
//   const regex = new RegExp(searchData.value, "i");
//   return rows.value.filter((option) =>
//     regex.test(option.drugstoreName || option.phone)
//   );
// });

// const fetchDrugstores = async () => {
//   loading.value = true;
//   try {
//     const response = await AppealService.getDrugstores();
//     const data = response.data.data;
//     drugs.value = data;
//     total.value = data.length;
//   } catch (e) {
//     console.error(e);
//   } finally {
//     loading.value = false;
//   }
// };

const handleCheck = (row) => {
  const findedRow = checkedBillings.value.findIndex(
    (bil) => bil.index === row.index
  );
  if (findedRow > -1) {
    checkedBillings.value.splice(findedRow, 1);
  } else {
    checkedBillings.value.push(row);
  }
};
const checkBil = computed(() => {
  return (row) => {
    return checkedBillings.value.some((bil) => bil.index === row.index);
  };
});

// return checkedBillings.value.some((drug) => drug.index === row.index);

const handleAllBillings = () => {
  if (checkAllBillings.value) {
    checkedBillings.value = [];
  } else {
    checkedBillings.value = [...billingData.value];
  }
};
const checkAllBillings = computed(() => {
  if (billingData.value.length === 0) {
    return false;
  }
  return checkedBillings.value.length === billingData.value.length;
});

const checkedBillingsIds = computed(() =>
  checkedBillings.value.map((bil) => bil.index)
);

const fileLoad = ref(false);
const fileError = ref("");
const getExcelData = async () => {
  fileLoad.value = true;
  fileError.value = "";
  try {
    const response = await ClientService.getDrugstoreExcelData(
      checkedDrugsIds.value,
      {
        startDate: dateRangeData.value.startDate,
        endDate: dateRangeData.value.endDate,
      }
    );

    // const fileName = row.drugstoreName;
    const fileDate = dayjs().format("D-MM-YY");
    const blob = new Blob([response.data], { type: response.data.type });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${dateRangeData.value.startDate}_${dateRangeData.value.endDate}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    fileError.value = `Ошибка при скачивании файла`;
  } finally {
    fileLoad.value = false;
  }
};

const handleRequest = (props) => {
  fetchBillings();
};

onMounted(() => {
  tableRef.value.requestServerInteraction();
});

const incrementPage = () => {
  tableRef.value.nextPage();
};
const decrementPage = () => {
  tableRef.value.prevPage();
};
const changePage = (pageNum) => {
  if (pageNum === "...") {
    return;
  } else {
    tableRef.value.setPagination({
      page: pageNum,
    });
  }
};

const selectOption = (option) => {
  tableRef.value.setPagination({
    rowsPerPage: option,
  });
};
</script>

<style scoped lang="scss">
.table-actions {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 16px;
}
.search-input {
  background-color: #fff;
  border-radius: 50px;
  width: 250px;
  font-size: 15px;
  color: #7a88a6;
}
:global(.reports-btn) {
  height: 24px;
}

.q-table {
  table-layout: fixed;
  border-radius: 12px;
  background-color: #fff;
  border-collapse: collapse;
}
.appeals-th {
  color: #404f6f;
  font-weight: 600;
  font-size: 11px;
}

.appeals-th:nth-of-type(1) {
  width: 56px;
}
.appeals-th:nth-of-type(2) {
}

.appeals-td {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: $primary;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
thead tr th {
  position: sticky;
  z-index: 1;
  background-color: #fff;
  text-transform: uppercase;
}
thead tr th:first-child {
  border-radius: 12px 0 0 0;
}
thead tr th:last-child {
  border-radius: 0 12px 0 0;
}
tbody tr:last-child td:last-child {
  border-radius: 0 0 12px 0;
}
thead tr:first-child th {
  top: 0;
}
thead tr:first-child th:last-child {
  right: 0;
  background-color: #fff;
}

tbody tr td:last-child {
  position: sticky;
  right: 0;
  background-color: #fff;
}

.user-settings-btn {
  background: none;
  cursor: pointer;
  padding: 0;
}

tr.clickable {
  cursor: pointer;

  :hover {
    .appeal-link {
      color: #219e9f;

      svg path {
        stroke: #219e9f;
      }
    }
  }

  .appeal-link {
    svg {
      transition: 0.3s cubic-bezier(0.33, 1, 0.68, 1);
    }
    svg.rotate {
      transform: rotate(180deg);
    }
  }
}

.v-collapse {
  transition: height 300ms cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
