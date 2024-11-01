<template>
  <div>
    <TableActions
      v-if="showTableActions"
      @update:search="handleSearch"
      @update:find="handleFind"
      @delete:option="handleDelete"
      :filter-options="filterQuery"
      :removeFilter="removeFilter"
      :showAdvancedFilter="showAdvancedFilter"
    >
      <template #appealBtn>
        <SimpleButton
          type="button"
          customClass="appeals-btn"
          :label="$t('create_appeal.buttons.create_appeal')"
          @click="handleClickCreateAppealBtn"
        />
      </template>
      <template #filters>
        <div
          class="filter-item"
          v-for="filterItem in filterData.filter((item) => item.meta)"
          :key="filterItem.name"
        >
          <SimpleInput
            v-if="filterItem.component === 'SimpleInput'"
            :label="filterItem.name"
            :placeholder="filterItem.placeholder"
            :modelValue="filterQuery[filterItem.type]"
            @update:model-value="
              (val) => selectFilterData(val, filterItem.type)
            "
          />
          <DateInput
            v-if="filterItem.component === 'DateInput'"
            :label="filterItem.name"
            placeholder="10-05-2024"
            :modelValue="filterQuery[filterItem.type]"
            @update:model-value="
              (val) => selectFilterData(val, filterItem.type)
            "
          />
          <DropdownSelectNew
            v-if="filterItem.component === 'DropdownSelectNew'"
            :label="filterItem.name"
            :options="filterItem.item"
            :multiple="filterItem.multiple"
            :selected-options="filterQuery[filterItem.type]"
            :search-input="filterItem.type !== 'appeal_status'"
            @select-option="
              (option) =>
                selectFilterData(option, filterItem.type, filterItem.multiple)
            "
            @request="fetchClinics"
          >
            <template #top-label>{{ filterItem.name }}</template>
            <template #placeholder>{{ filterItem.placeholder }}</template>
            <template #option-content="{ option }">
              <div>
                {{ typeof filterItem.item !== "object" ? option : option.name }}
              </div>
              <CheckIcon
                v-if="
                  checkSelectedOption(
                    option,
                    filterItem.type,
                    filterItem.multiple
                  )
                "
              />
            </template>
            <template v-slot:selected-options-once="{ option }">
              <div>
                {{ typeof filterItem.item !== "object" ? option : option.name }}
              </div>
            </template>
            <template v-slot:selected-options-length="{ length }">
              {{
                $t(`create_appeal.dropdowns.${filterItem.type}_choise`, length)
              }}
            </template>
          </DropdownSelectNew>
        </div>
      </template>
    </TableActions>
    <!-- table -->

    <div>
      <q-table
        flat
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filter="search"
        hide-pagination
        :rows-per-page-options="
          reactivePagination === undefined ? [0] : undefined
        "
        ref="tableRef"
        row-key="index"
        v-model:pagination="reactivePagination"
        no-data-label="Обращений нет"
        no-results-label="Данных по вашему запросу не найдено"
        binary-state-sort
        @request="requestData"
      >
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:no-data="{ icon, message, filter }">
          <div class="full-width row flex-center text-accent q-gutter-sm">
            <span class="error-message"> {{ message }} </span>
            <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
          </div>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols.filter(
                (col) => col.name !== 'userSettings'
              )"
              :key="col.name"
              :props="props"
              class="appeals-th"
              :class="{ 'text-left': col.name === 'expenseAmount' }"
            >
              {{ col.label }}
            </q-th>
            <q-th class="text-right">
              <q-icon size="20px">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.205 0.5H8.79584C9.67417 0.5 10.3867 1.17167 10.3867 2C10.3868 2.21659 10.4433 2.42943 10.5504 2.61764C10.6576 2.80586 10.8119 2.96299 10.998 3.07365C11.1842 3.18431 11.396 3.24468 11.6125 3.24886C11.8291 3.25305 12.043 3.20089 12.2333 3.0975L12.3183 3.05167C13.0792 2.6375 14.0517 2.88333 14.4908 3.60083L15.2867 4.89917C15.7258 5.61667 15.465 6.53417 14.7042 6.94917C13.8708 7.40167 13.8708 8.59833 14.7042 9.05167C15.465 9.46583 15.7258 10.3833 15.2867 11.1008L14.4908 12.3992C14.0517 13.1167 13.0792 13.3625 12.3175 12.9492L12.2333 12.9025C12.043 12.7991 11.8291 12.747 11.6125 12.7511C11.396 12.7553 11.1842 12.8157 10.998 12.9264C10.8119 13.037 10.6576 13.1941 10.5504 13.3824C10.4433 13.5706 10.3868 13.7834 10.3867 14C10.3867 14.8283 9.67417 15.5 8.795 15.5H7.20417C6.32584 15.5 5.61333 14.8283 5.61333 14C5.61318 13.7834 5.55675 13.5706 5.44957 13.3824C5.34239 13.1941 5.18815 13.037 5.00196 12.9264C4.81577 12.8157 4.60402 12.7553 4.38747 12.7511C4.17091 12.747 3.95699 12.7991 3.76667 12.9025L3.6825 12.9483C2.92083 13.3625 1.94833 13.1167 1.50917 12.3992L0.713335 11.1008C0.274168 10.3833 0.535001 9.46583 1.29583 9.05083C2.12917 8.59833 2.12917 7.40167 1.29583 6.94833C0.535001 6.53417 0.274168 5.61667 0.713335 4.89917L1.50917 3.60083C1.94833 2.88333 2.92083 2.6375 3.6825 3.05083L3.76667 3.0975C3.95699 3.20089 4.17091 3.25305 4.38747 3.24886C4.60402 3.24468 4.81577 3.18431 5.00196 3.07365C5.18815 2.96299 5.34239 2.80586 5.44957 2.61764C5.55675 2.42943 5.61318 2.21659 5.61333 2C5.61333 1.17167 6.32583 0.5 7.205 0.5ZM8 10.5C8.66304 10.5 9.29893 10.2366 9.76777 9.76777C10.2366 9.29893 10.5 8.66304 10.5 8C10.5 7.33696 10.2366 6.70107 9.76777 6.23223C9.29893 5.76339 8.66304 5.5 8 5.5C7.33696 5.5 6.70108 5.76339 6.23223 6.23223C5.76339 6.70107 5.5 7.33696 5.5 8C5.5 8.66304 5.76339 9.29893 6.23223 9.76777C6.70108 10.2366 7.33696 10.5 8 10.5Z"
                    fill="#7A88A6"
                  />
                </svg>
              </q-icon>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr
            :props="props"
            @mouseup="(e) => cancelOpenWhenSelect(props.row, e)"
            class="clickable"
          >
            <q-td key="index" :props="props" class="appeals-td">
              {{ props.row.index }}
            </q-td>
            <q-td key="client" :props="props" class="appeals-td">
              <a class="appeal-link">
                {{ props.row.clientLastname }} {{ props.row.clientFirstname }}
                <span
                  style="color: var(--q-negative)"
                  v-if="props.row.specificType === 1"
                  >*</span
                >
              </a>
              <TableTooltip>
                {{ props.row.clientLastname }} {{ props.row.clientFirstname }}
              </TableTooltip>
            </q-td>
            <q-td key="appealDate" :props="props" class="appeals-td">
              {{ props.row.appealDate }}
              <TableTooltip>
                {{ props.row.appealDate }}
              </TableTooltip>
            </q-td>
            <q-td key="finishedDate" :props="props" class="appeals-td">
              {{ props.row.finishedDate }}
              <TableTooltip>
                {{ props.row.finishedDate }}
              </TableTooltip>
            </q-td>
            <q-td key="appealStatus" :props="props" class="appeals-td">
              <AppealStatus :status="props.row.appealStatus" />
            </q-td>
            <q-td key="clinicName" :props="props" class="appeals-td">
              {{ props.row.clinicName }}
              <TableTooltip>
                {{ props.row.clinicName }}
              </TableTooltip>
            </q-td>
            <q-td key="doctorName" :props="props" class="appeals-td">
              {{ props.row.doctorName }}
              <TableTooltip>
                {{ props.row.doctorName }}
              </TableTooltip>
            </q-td>
            <q-td key="serviceName" :props="props" class="appeals-td">
              {{ props.row.serviceName }}
              <TableTooltip>
                {{ props.row.serviceName }}
              </TableTooltip>
            </q-td>
            <q-td key="diagnosisName" :props="props" class="appeals-td">
              {{ props.row.diagnosisName }}
              <TableTooltip>
                {{ props.row.diagnosisName }}
              </TableTooltip>
            </q-td>
            <q-td key="limits" :props="props" class="appeals-td">
              <SimpleButton
                full-width
                :label="`${$t('client_table.limits').toLowerCase()} &#129125;`"
                :custom-class="[
                  'appeals-btn',
                  'reports-btn',
                  { 'alert-btn': props.row.limits?.length === 0 },
                ]"
                @click="openAppealLimit(props.row)"
              >
              </SimpleButton>
              <TableTooltip show v-if="props.row.limits?.length > 0">
                {{ props.row.limits }}
              </TableTooltip>
              <TableTooltip show v-else> Лимиты не назначены </TableTooltip>
            </q-td>
            <q-td key="expenseAmount" :props="props" class="appeals-td">
              {{ formatPrice(props.row.expenseAmount, false) }}
            </q-td>
            <q-td
              key="userSettings"
              :props="props"
              class="appeals-td text-right"
            >
              <UserSettings
                :client="props.row"
                @open-modal="openAppealPage(props.row)"
                @open-modal-limit="openAppealLimit(props.row)"
                @delete-appeal="deleteAppeal(props.row)"
              ></UserSettings>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <!-- pagination -->
    <div class="flex q-my-lg" v-if="showPagination">
      <PaginationTable
        v-if="reactivePagination"
        :pagination="reactivePagination"
        @onIncrementPage="incrementPage"
        @onDecrementPage="decrementPage"
        @onChangePage="changePage"
      />
      <q-space></q-space>
      <RowsPerPage
        v-if="reactivePagination"
        @choiceOption="selectOption"
        :pagination="reactivePagination"
        :total="total"
      />
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import formatPrice from "src/helpers/formatPrice";
import Trans from "src/i18n/translation";
import { useRouter } from "vue-router";
import AppealStatus from "./AppealStatus.vue";
import RowsPerPage from "./RowsPerPage.vue";
import UserSettings from "./UserSettings.vue";
import TableTooltip from "src/components/Shared/TableTooltip.vue";
import PaginationTable from "./PaginationTable.vue";
import TableActions from "./TableActions.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import DropdownSelectNew from "../Shared/DropdownSelectNew.vue";
import CheckIcon from "../Shared/CheckIcon.vue";
import SimpleInput from "../Shared/SimpleInput.vue";
import DateInput from "../Shared/DateInput.vue";
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { useClientTableStore } from "src/stores/clientTableStore";
import { useAppealStore } from "src/stores/appealStore";

import { toRefs } from "vue";
import { toRef } from "vue";
import { useAppealsHistory } from "src/composables/useAppealsHistory";
import useNotifications from "src/composables/useNotifications";
import { useCommonStore } from "src/stores/commonStore";

const $q = useQuasar();
const router = useRouter();
const emit = defineEmits(["createAppeal"]);

const props = defineProps({
  pagination: {
    type: Object,
  },
  rows: {
    type: Object,
  },
  columns: {
    type: Object,
  },
  loading: {
    type: Boolean,
  },
  filterData: {},
  requestData: {},
  selectFilterData: {},
  filterQuery: {},
  checkSelectedOption: {},
  removeFilter: {},
  fetchClinics: {},
  total: {},
  showTableActions: {
    type: Boolean,
    default: true,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
  showAdvancedFilter: {
    type: Boolean,
    default: true,
  },
});

const tableRef = ref(null);
const appealStore = useAppealStore();
const commonStore = useCommonStore();
const { deleteData } = useAppealsHistory();

const reactiveProps = toRefs(props);
const reactivePagination = toRef(reactiveProps, "pagination");

const search = ref("");

const count = computed(() => commonStore.notificationCount);

const handleSearch = (searchValue) => {
  search.value = searchValue;
};
const handleFind = () => {
  tableRef.value.requestServerInteraction();
};
const handleDelete = () => {
  tableRef.value.requestServerInteraction();
};

// const clientTableStore = useClientTableStore();
// const { pagination, rows, columns, loading } = storeToRefs(clientTableStore);

const cancelOpenWhenSelect = (client, e) => {
  const selection = window.getSelection().toString();
  const isButton = !!e.target.closest("BUTTON");

  if (!selection && !isButton) {
    openAppealPage(client);
  } else {
    return;
  }
};
//handle click create appeal
const handleClickCreateAppealBtn = () => {
  emit("createAppeal");
};

//incremenet decrement and change page events
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

//10-25-30
const selectOption = (option) => {
  tableRef.value.setPagination({
    rowsPerPage: option,
  });
};

const openAppealPage = async (client) => {
  // appealStore.setClient(client);
  appealStore.setTypeOfAppeal("CHANGE");

  $q.loading.show({
    delay: 500,
  });

  await appealStore.fetchApplicantData(client.appealId);
  await appealStore.fetchHospitalData();

  $q.loading.hide();
  router.push(
    Trans.i18nRoute({
      name: "createAppeal",
      params: { id: client.appealId },
    })
  );
};

const openAppealLimit = async (client) => {
  appealStore.setClient(client);
  appealStore.setTypeOfAppeal("CHANGE");
  $q.loading.show({
    delay: 500,
  });

  await appealStore.fetchMedicalPrograms();
  await appealStore.fetchApplicantData(client.appealId);
  await appealStore.fetchHospitalData();

  $q.loading.hide();
  router.push(
    Trans.i18nRoute({
      name: "createAppealLimit",
      params: { id: client.appealId },
    })
  );
};

const deleteAppeal = async (data) => {
  await appealStore.deleteAppealData(data.appealId);

  //appealsHistory
  deleteData(data.appealId);
  tableRef.value.requestServerInteraction();
};

//only router if needs
//if query page or limit will changes, pagination will changes
// watch(
//   () => route.query,
//   (newVal) => {
//     tableRef.value.setPagination({
//       page: parseInt(newVal.page) || 1,
//       rowsPerPage: parseInt(newVal.limit) || 10,
//     });
//   }
// );

//add numerable table

//first request to API on mounted
onMounted(() => {
  tableRef.value.requestServerInteraction();

  watch(
    () => appealStore.successAppeal,
    (newSuccessAppeal) => {
      if (newSuccessAppeal) {
        tableRef.value.requestServerInteraction();
      }
    }
  );

  watch(count, () => {
    tableRef.value.requestServerInteraction();
    
  });

  watch(
    () => props.filterQuery,
    () => {
      console.log(`watcher`, props.filterQuery);
    }
  );
});

//calculate table height for showing only 10 rows
// onMounted(() => {
//   const qTableMiddleElement = document.querySelector(".q-table__middle");
//   // qTableMiddleElement.style.height = `${48 + 8 + 44 * 10}px`;

//   const qTableElement = document.querySelector(".q-table");
//   const qTableInnerElement = document.createElement("div");
//   qTableInnerElement.className = "q-table-inner-element";
//   qTableInnerElement.appendChild(qTableElement);
//   qTableMiddleElement.appendChild(qTableInnerElement);
// });
</script>

<style lang="scss" scoped>
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
  width: 64px;
}
.appeals-th:nth-of-type(2) {
  width: 280px;
}
.appeals-th:nth-of-type(3) {
  width: 140px;
}
.appeals-th:nth-of-type(4) {
  width: 140px;
}
.appeals-th:nth-of-type(5) {
  width: 150px;
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

.filter-item {
  padding-bottom: 20px;
}
.error-message {
  font-weight: 500;
}
</style>
