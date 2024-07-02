<template>
  <div>
    <div class="table-actions">
      <div class="appeals-filter">
        <div class="appeals-search-input">
          <q-input
            rounded
            dense
            borderless
            class="search-input q-px-sm"
            :placeholder="$t('search')"
            debounce="300"
            v-model="searchData"
          >
            <template v-slot:prepend>
              <q-icon>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.16659 15C12.3882 15 14.9999 12.3883 14.9999 9.16665C14.9999 5.94499 12.3882 3.33331 9.16659 3.33331C5.94492 3.33331 3.33325 5.94499 3.33325 9.16665C3.33325 12.3883 5.94492 15 9.16659 15Z"
                    stroke="#B8C2D1"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.6666 16.6666L13.3333 13.3333"
                    stroke="#B8C2D1"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <ReportsByDate />
    </div>
    <div>
      <q-table
        flat
        :rows="filteredRows"
        :columns="columns"
        :loading="loading"
        v-model:pagination="pagination"
        hide-pagination
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
              class="appeals-th"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="index" :props="props" class="appeals-td">
              {{ props.row.index }}
            </q-td>
            <q-td key="clinicName" :props="props" class="appeals-td">
              <a class="appeal-link">
                {{ props.row.clinicName }}
              </a>
            </q-td>
            <q-td key="phone" :props="props" class="appeals-td">
              {{ props.row.phone }}
            </q-td>
            <q-td key="reports" :props="props" class="appeals-td">
              <SimpleButton
                label="Скачать отчет"
                custom-class="appeals-btn reports-btn"
                @click="getExcelData(props.row)"
              />
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
import AppealService from "src/services/AppealService";
import ClientService from "src/services/ClientService";
import PaginationTable from "./PaginationTable.vue";
import RowsPerPage from "./RowsPerPage.vue";
import { onMounted, computed, ref } from "vue";
import SimpleButton from "../Shared/SimpleButton.vue";
import { useI18n } from "vue-i18n";
import dayjs from "dayjs";

import ReportsByDate from "../ReportsByDate.vue";

const { t } = useI18n();

const loading = ref(false);
const clinics = ref([]);
const total = ref(0);
const tableRef = ref(null);
const searchData = ref("");

const pagination = ref({
  sortBy: "desc",
  descending: false,
  rowsPerPage: 10,
  page: 1,
});

const columns = computed(() => [
  {
    name: "index",
    label: "№",
    field: "index",
    align: "left",
  },
  {
    name: "clinicName",
    align: "left",
    label: t("client_table.clinic"),
    field: "clinicName",
  },
  {
    name: "phone",
    align: "left",
    label: "Телефон",
    field: "phone",
  },
  {
    name: "reports",
    align: "left",
    label: "Отчет",
    field: "organizationName",
  },
]);

const rows = computed(() => {
  return clinics.value.map((row) => {
    return {
      clinicName: row.name,
      phone: row.phone,
      reports: "",
      index: row.id,
    };
  });
});

const filteredRows = computed(() => {
  const regex = new RegExp(searchData.value, "i");
  return rows.value.filter((option) =>
    regex.test(option.clinicName || option.phone)
  );
});

const fetchClinics = async () => {
  loading.value = true;
  try {
    const response = await AppealService.getClinics();
    const data = response.data.data;
    clinics.value = data;
    total.value = data.length;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const fileLoad = ref(false);
const fileError = ref("");
const getExcelData = async (row) => {
  fileLoad.value = true;
  fileError.value = "";
  try {
    const response = await ClientService.getClinicExcelData(row.index);

    const fileName = row.clinicName;
    const fileDate = dayjs().format("D-MM-YY");
    const blob = new Blob([response.data], { type: response.data.type });
    console.log(`clinic table`, response);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}-${fileDate}.xlsx`);
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
  fetchClinics(props.pagination.page, props.pagination.rowsPerPage);
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
// .appeals-th:nth-of-type(2) {
//   width: 200px;
// }
// .appeals-th:nth-of-type(3) {
//   width: 150px;
// }
// .appeals-th:nth-of-type(4) {
//   width: 120px;
// }
// .q-table thead th:last-of-type {
//   width: 52px;
// }
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
}
</style>
