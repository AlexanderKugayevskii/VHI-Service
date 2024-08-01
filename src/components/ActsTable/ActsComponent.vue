<template>
  <div>
    <div class="table-actions">
      <div class="table-actions-right">
        <!-- is agent -->
        <div class="tabs-container" v-if="isAgent">
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

        <!-- is clinic -->

        <DropdownSelectNew
          v-if="isClinic"
          label="Клиника"
          :multiple="false"
          :loading="loading"
          :options="clinics"
          :disable-choise="isClinic"
          :selected-options="selectedClinic"
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

        <DateSearch
          class="table-actions-range"
          @get-range="handleDateRange"
          @get-data="requestGetFields"
          :disabled-rule="disableButton"
        />
      </div>
    </div>

    <div class="acts-result q-mb-lg" v-if="actsData">
      <ActsTable :dataRows="actsData" />
    </div>

    <div class="fields-result" v-if="fieldsData">
      <div
        class="fields-result-group q-mb-lg"
        v-if="fieldsData.services.length > 0"
      >
        <h3 class="page-title q-my-none q-mb-md">Сервисы</h3>
        <ServiceTable :dataRows="fieldsData.services" />
      </div>
      <div v-else></div>
      <div
        class="fields-result-group q-mb-lg"
        v-if="fieldsData.doctors.length > 0"
      >
        <h3 class="page-title q-my-none q-mb-md">Врачи</h3>
        <DoctorsTable :dataRows="fieldsData.doctors" />
      </div>
      <div
        class="fields-result-group--amount"
        v-if="fieldsData.services.length > 0 && fieldsData.doctors.length > 0"
      >
        <p>
          Общая сумма: {{ formatPrice(parseFloat(fieldsData.total_amount)) }}
        </p>
      </div>
      <div
        class="fields-result-action flex flex-center"
        v-if="fieldsData.services.length > 0 && fieldsData.doctors.length > 0"
      >
        <SimpleButton
          type="button"
          customClass="appeals-btn"
          label="Создать акт"
          @click="createActByClinic"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import AppealService from "src/services/AppealService";
import ActService from "src/services/ActService";
import DateSearch from "./DateSearch.vue";
import SimpleCheckbox from "../Shared/SimpleCheckbox.vue";
import SimpleButton from "../Shared/SimpleButton.vue";
import DropdownSelectNew from "../Shared/DropdownSelectNew.vue";
import CheckIcon from "../Shared/CheckIcon.vue";
import { useAppealStore } from "src/stores/appealStore";
import { useAuthStore } from "src/stores/authStore";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import ServiceTable from "./ServiceTable.vue";
import DoctorsTable from "./DoctorsTable.vue";
import ActsTable from "./ActsTable.vue";
import { formatTimeAgo } from "@vueuse/core";
import formatPrice from "src/helpers/formatPrice";

const { t } = useI18n();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const appealStore = useAppealStore();
const isClinic = computed(() => appealStore.isClinic);
const isAgent = computed(() => appealStore.isAgent);
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

// clinics
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
const setDefaultClinicIfIsClinic = () => {
  if (isClinic.value) {
    selectedClinic.value = user.value.hospital;
  }
};
const checkSelectedClinic = (option) => selectedClinic.value?.id === option.id;

// drugstore
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

const actsData = ref(null);
const getActByAgent = async () => {
  try {
    const response = await ActService.getAct();
    const data = response.data;
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};

const getActByClinic = async () => {
  try {
    const response = await ActService.getAct({
      application_type: 1,
      hospital_id: selectedClinic.value.id,
    });
    const data = response.data.data.data;

    actsData.value = data;
  } catch (e) {
    console.error(e);
  }
};

//get Fields Services Doctors Drugs By Clinic
const fieldsData = ref(null);
const requestGetFields = async () => {
  try {
    if (isClinic.value) {
      const response = await ActService.getFields({
        hospital_id: selectedClinic.value?.id,
        application_type: 1,
        akt_date: dateRangeData.value.aktDate,
        esf_date: dateRangeData.value.esfDate,
      });
      const data = response.data;
      fieldsData.value = data;
    }
  } catch (e) {
  } finally {
  }
};

const createActByClinic = async () => {
  const servicesIds = fieldsData.value.services.map((service) => service.id);
  const doctorsIds = fieldsData.value.doctors.map((doctor) => doctor.id);

  const payload = {
    akt_date: dateRangeData.value.aktDate,
    sent_date: dateRangeData.value.esfDate,
    hospital_id: selectedClinic.value?.id,
    application_type: 1,
    service_ids: servicesIds,
    doctor_ids: doctorsIds,
    amount: fieldsData.value.total_amount,
  };

  console.log(payload);

  try {
    const response = await ActService.createAct(payload);
    const data = response.data;
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};

//request before mounting page
onBeforeMount(async () => {
  setDefaultClinicIfIsClinic();
  if (isClinic.value) {
    await getActByClinic();
  }
});

//request table
const handleRequest = (props) => {
  fetchDrugstores(props.pagination.page, props.pagination.rowsPerPage);
};
// onMounted(() => {
//   tableRef.value.requestServerInteraction();
// });

//pagination logic
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
  margin-bottom: 32px;
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

.fields-result-group--amount {
  p {
    text-align: right;
    font-weight: 700;
    font-size: 24px;
  }
}
</style>
