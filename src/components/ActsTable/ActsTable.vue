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
    </div>
    <div class="act-service-table">
      <q-table
        flat
        :rows="rows ?? []"
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
          <q-tr :props="props" @mouseup="cancelOpenWhenSelect(props.row)">
            <q-td key="index" :props="props" class="appeals-td">
              {{ props.row.index }}
            </q-td>
            <q-td key="date" :props="props" class="appeals-td">
              {{ props.row.date }}
            </q-td>
            <q-td key="esfDate" :props="props" class="appeals-td">
              {{ props.row.esfDate }}
            </q-td>
            <q-td key="amount" :props="props" class="appeals-td">
              {{ formatPrice(parseFloat(props.row.amount)) }}
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
      <!-- <RowsPerPage
        @choiceOption="selectOption"
        :pagination="pagination"
        :total="total"
      /> -->
    </div>
  </div>
</template>

<script setup>
import PaginationTable from "../ClientsTable/PaginationTable.vue";
import RowsPerPage from "../ClientsTable/RowsPerPage.vue";
import { onMounted, computed, ref } from "vue";
import { useAppealStore } from "src/stores/appealStore";

import { useI18n } from "vue-i18n";
import ActService from "src/services/ActService";
import formatPrice from "src/helpers/formatPrice";
import formatDate from "src/helpers/formatDate";

const { t } = useI18n();

const props = defineProps({
  selectedClinic: {
    type: Object,
  },
});

const emit = defineEmits(["showFields", "downloadAct"]);
const appealStore = useAppealStore();

const loading = ref(false);
const total = ref(12);
const tableRef = ref(null);
const searchData = ref("");
const actsData = ref(null);

const isClinic = computed(() => appealStore.isClinic);
const isAgent = computed(() => appealStore.isAgent);

const pagination = ref({
  sortBy: "desc",
  descending: false,
  rowsPerPage: 10,
  rowsNumber: 0,
  page: 1,
});

const columns = computed(() => [
  {
    name: "index",
    field: "index",
    label: "№",
    align: "left",
  },
  {
    name: "date",
    field: "date",
    label: "Дата акта",
    align: "left",
  },
  {
    name: "esfDate",
    field: "esfDate",
    label: "Дата ЭСФ",
    align: "left",
  },
  {
    name: "amount",
    label: "Сумма",
    align: "left",
    field: "amount",
  },
]);

const rows = computed(() => {
  return actsData.value?.map((row) => {
    return {
      date: formatDate(row.date, { withHours: false }),
      esfDate: formatDate(row.esf_date, { withHours: false }),
      index: row.id,
      amount: row.amount,
    };
  });
});

const getAct = async (page, limit) => {
  try {
    const response = isClinic.value
      ? await ActService.getAct(page, limit, {
          application_type: 1,
          hospital_id: props.selectedClinic.id,
        })
      : await ActService.getAct(page, limit);
    const data = response.data.data.data;

    pagination.value.page = page;
    pagination.value.rowsPerPage = 10;
    pagination.value.rowsNumber = response.data.data.total;

    actsData.value = data;

    console.log(actsData.value);
  } catch (e) {
    console.error(e);
  }
};

// const filteredRows = computed(() => {
//   const regex = new RegExp(searchData.value, "i");
//   return rows.value?.filter((option) => {
//     return regex.test(option.date) || regex.test(option.esfDate);
//   });
// });

const cancelOpenWhenSelect = (row) => {
  const selection = window.getSelection().toString();
  if (!selection) {
    emit("showFields", row.index);
  } else {
    return;
  }
};

const handleDownloadAct = (row) => {
  emit("downloadAct", row.index);
};

const handleRequest = (props) => {
  getAct(props.pagination.page, props.pagination.rowsPerPage);
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

<style lang="scss" scoped>
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
.appeal-link {
  font-size: 14px;
  line-height: 20px;
  color: #13b8ba;
  text-decoration: none;
  cursor: pointer;
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
  width: 250px;
}

.q-table thead th:last-of-type {
  width: 52px;
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
}
</style>
