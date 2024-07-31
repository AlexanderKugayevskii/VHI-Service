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
      <div class="table-actions-right">
        <div class="tabs-container">
          <div class="tabs-header q-mb-md">
            <q-tabs
              dense
              active-class="tab-active"
              v-model="tab"
              content-class="details-tabs-header"
              align="left"
            >
              <q-tab
                name="clinics"
                label="Клиники"
                :ripple="false"
                class="tabs--no-hover"
              >
              </q-tab>
              <q-tab
                name="drugstore"
                label="Аптеки"
                :ripple="false"
                class="tabs--no-hover"
              >
              </q-tab>
            </q-tabs>
          </div>
          <div class="tabs-content">
            <q-tab-panels
              v-model="tab"
              animated
              transition-prev="jump-up"
              transition-next="jump-down"
            >
              <q-tab-panel name="clinics" key="clinics">
                <div class="tab-header">
                  <DropdownSelectNew
                    label="Клиника"
                    :multiple="false"
                    :loading="loading"
                    :options="clinics"
                    :selected-options="selectedClinic"
                    @select-option="selectClinic"
                    @request="fetchClinics"
                  >
                    <template #top-label> Клиника </template>
                    <template #placeholder>
                      {{ $t("create_appeal.dropdowns.clinic") }}
                    </template>
                    <template v-slot:selected-options-once="props">
                      <div>{{ props.option.name }}</div>
                    </template>
                    <template v-slot:option-content="props">
                      <div>{{ props.option.name }}</div>
                      <CheckIcon v-if="checkSelectedClinic(props.option)" />
                    </template>
                  </DropdownSelectNew>
                </div>
              </q-tab-panel>
              <q-tab-panel name="drugstore" key="drugstore">
                <div class="tab-header">
                  <DropdownSelectNew
                    label="Аптека"
                    :multiple="false"
                    :loading="loading"
                    :options="drugstores"
                    :selected-options="selectedDrugstore"
                    @select-option="selectDrugstore"
                    @request="fetchDrugstores"
                  >
                    <template #top-label> Аптека </template>
                    <template #placeholder> Выберите аптеку </template>
                    <template v-slot:selected-options-once="props">
                      <div>{{ props.option.name }}</div>
                    </template>
                    <template v-slot:option-content="props">
                      <div>{{ props.option.name }}</div>
                      <CheckIcon v-if="checkSelectedDrugstore(props.option)" />
                    </template>
                  </DropdownSelectNew>
                </div>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>

        <DateSearch
          class="table-actions-range"
          @get-range="handleDateRange"
          @get-data="searchActData"
          :disabled-rule="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import AppealService from "src/services/AppealService";
import ClientService from "src/services/ClientService";
import ActService from "src/services/ActService";
import PaginationTable from "../ClientsTable/PaginationTable.vue";
import RowsPerPage from "../ClientsTable/RowsPerPage.vue";
import DateRange from "../DateRange.vue";
import DateSearch from "./DateSearch.vue";
import SimpleCheckbox from "../Shared/SimpleCheckbox.vue";
import DropdownSelectNew from "../Shared/DropdownSelectNew.vue";
import CheckIcon from "../Shared/CheckIcon.vue";

const { t } = useI18n();
const tab = ref("clinics");

const loading = ref(false);
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
    name: "checkbox",
    label: "",
    field: "checkbox",
    align: "left",
  },
  {
    name: "drugstoreName",
    align: "left",
    label: t("client_table.drugstore"),
    field: "drugstoreName",
  },
  {
    name: "phone",
    align: "left",
    label: "Телефон",
    field: "phone",
  },
]);

const rows = computed(() => {
  return drugs.value.map((row) => {
    return {
      drugstoreName: row.name,
      phone: row.phone,
      reports: "",
      index: row.id,
    };
  });
});

const filteredRows = computed(() => {
  const regex = new RegExp(searchData.value, "i");
  return rows.value.filter((option) =>
    regex.test(option.drugstoreName || option.phone)
  );
});

// act + esf search logic
const dateRangeData = ref(null);
const handleDateRange = (rangeData) => {
  dateRangeData.value = rangeData;
};
const disableButton = computed(() => {
  return dateRangeData.value === null || dateRangeData.value.checkActiveButton;
});

const clinics = ref([]);
const selectedClinic = ref(null);
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
const selectClinic = (clinic) => {
  selectedClinic.value = clinic;
};
const checkSelectedClinic = (option) => selectedClinic.value?.id === option.id;

const drugstores = ref([]);
const selectedDrugstore = ref(null);
const fetchDrugstores = async () => {
  loading.value = true;
  try {
    const response = await AppealService.getDrugstores();
    const data = response.data.data;
    drugstores.value = data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
const selectDrugstore = (drugstore) => {
  selectedDrugstore.value = drugstore;
};
const checkSelectedDrugstore = (option) =>
  selectedDrugstore.value?.id === option.id;

const applicationType = computed(() => {
  const payloadData = {
    // akt_date: dateRangeData.value?.actDate,
    // esf_date: dateRangeData.value?.esfDate,
  };
  if (tab.value === "clinics") {
    delete payloadData.drugstore_id;
    payloadData.application_type = 1;
    payloadData.hospital_id = selectedClinic.value?.id;
  } else if (tab.value === "drugstore") {
    delete payloadData.hospital_id;
    payloadData.application_type = 0;
    payloadData.drugstore_id = selectedDrugstore.value?.id;
  }

  return payloadData;
});
//getAct
const searchActData = async () => {
  try {
    // const response = await ActService.getAct(applicationType.value);
    const response = await ActService.getAct({
      hospital_id: selectedClinic.value?.id,
      application_type: 1,
    });
    const data = response.data;
    console.log(data);
  } catch (e) {
  } finally {
  }
};

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
  fetchDrugstores(props.pagination.page, props.pagination.rowsPerPage);
};

// onMounted(() => {
//   tableRef.value.requestServerInteraction();
// });

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
  width: 56px;
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

.reports {
}
.table-actions {
  column-gap: 20px;
}

.table-actions-right {
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
  column-gap: 12px;

  .tabs-container {
    flex-basis: 50%;
  }
  .table-actions-range {
    min-width: 400px;
  }
}

.q-tab-panels {
  background: none;
}
</style>
