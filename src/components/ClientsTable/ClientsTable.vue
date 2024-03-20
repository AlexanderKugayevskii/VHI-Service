<template>
  <div>
    <q-table
      flat
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :filter="search"
      hide-pagination
      ref="tableRef"
      row-key="index"
      v-model:pagination="pagination"
      no-data-label="I didn't find anything for you"
      no-results-label="The filter didn't uncover any results"
      @request="clientTableStore.handleRequest"
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
        <q-tr :props="props" @click="openAppealPage(props.row)">
          <q-td key="index" :props="props" class="appeals-td">
            {{ props.row.index }}
          </q-td>
          <q-td key="client" :props="props" class="appeals-td">
            <a class="appeal-link" >
              {{ props.row.clientFirstname }} {{ props.row.clientLastname }}
            </a>
          </q-td>
          <q-td key="appealDate" :props="props" class="appeals-td">
            {{ props.row.appealDate }}
          </q-td>
          <q-td key="appealStatus" :props="props" class="appeals-td">
            <AppealStatus :status="props.row.appealStatus" />
          </q-td>
          <q-td key="clinicName" :props="props" class="appeals-td">
            {{ props.row.clinicName }}
          </q-td>
          <q-td key="doctorName" :props="props" class="appeals-td">
            {{ props.row.doctorName }}
          </q-td>
          <q-td key="serviceName" :props="props" class="appeals-td">
            {{ props.row.serviceName }}
          </q-td>
          <q-td key="diagnosisName" :props="props" class="appeals-td">
            {{ props.row.diagnosisName }}
          </q-td>
          <q-td key="expenseAmount" :props="props" class="appeals-td">
            {{ props.row.expenseAmount }}
          </q-td>
          <q-td key="userSettings" :props="props" class="appeals-td text-right">
            <UserSettings :client="props.row"></UserSettings>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
  <div class="flex q-my-lg">
    <!-- <PaginationTable :pagination="pagination" @change-page="updatePage" /> -->
    <div class="flex">
      <div class="pagination flex items-center">
        <!-- prev -->
        <button
          type="button"
          :disabled="hasPrevPage"
          @click="decrementPage"
          class="pagination-btn-control"
        >
          <q-icon size="20px">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.6667 15L6.66675 10L11.6667 5"
                stroke="#B8C2D1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </q-icon>
          <span>{{ $t("pagination.prev") }}</span>
        </button>

        <button
          type="button"
          class="pagination-btn-num"
          :class="{
            'pagination-btn-num--active': pageNum === pagination.page,
            'pagination-btn-num--cursor-default': pageNum === '...',
          }"
          v-for="pageNum in paginationRange"
          :key="pageNum"
          @click="changePage(pageNum)"
        >
          {{ pageNum }}
        </button>
        <!-- next -->
        <button
          type="button"
          :disabled="hasNextPage"
          @click="incrementPage"
          class="pagination-btn-control"
        >
          <span>{{ $t("pagination.next") }}</span>
          <q-icon size="20px"
            ><svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.33337 15L13.3334 10L8.33337 5"
                stroke="#7A88A6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </q-icon>
        </button>
      </div>
    </div>

    <q-space></q-space>
    <RowsPerPage @choiceOption="selectOption" />
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";

import Trans from "src/i18n/translation";
import { useRouter } from "vue-router";
import AppealStatus from "./AppealStatus.vue";
import StatusBar from "../Shared/StatusBar.vue";
import RowsPerPage from "./RowsPerPage.vue";
import UserSettings from "./UserSettings.vue";
import { onMounted, computed, ref, watch } from "vue";

import { useClientTableStore } from "src/stores/clientTableStore";
import { useAppealStore } from "src/stores/appealStore";
import { storeToRefs } from "pinia";
import usePaginate from "src/composables/usePaginate";

const $q = useQuasar();

const router = useRouter();
const searchProp = defineProps(["search"]);
const search = computed(() => searchProp.search);

const tableRef = ref(null);

const appealStore = useAppealStore();
const clientTableStore = useClientTableStore();
const { pagination, rows, columns, loading } = storeToRefs(clientTableStore);
const { hasNextPage, hasPrevPage, paginationRange } = usePaginate(pagination);

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
  appealStore.setClient(client);
  appealStore.setTypeOfAppeal("CHANGE");
  $q.loading.show({
    delay: 500,
  });
  await appealStore.fetchApplicantData();
  await appealStore.fetchHospitalData();

  $q.loading.hide();
  router.replace(
    Trans.i18nRoute({
      name: "createAppeal",
      params: { id: appealStore.client.contractClientId },
    })
  );
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
});

//calculate table height for showing only 10 rows
onMounted(() => {
  const qTableMiddleElement = document.querySelector(".q-table__middle");
  qTableMiddleElement.style.height = `${48 + 8 + 44 * 10}px`;

  const qTableElement = document.querySelector(".q-table");
  const qTableInnerElement = document.createElement("div");
  qTableInnerElement.className = "q-table-inner-element";
  qTableInnerElement.appendChild(qTableElement);
  qTableMiddleElement.appendChild(qTableInnerElement);
});
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
  width: 48px;
}
.appeals-th:nth-of-type(2) {
  width: 250px;
}
.appeals-th:nth-of-type(4) {
  min-width: 120px;
}

.appeals-td {
  font-family: "Roboto", sans-serif;
  font-size: 14px;
  color: $primary;
}
thead tr th {
  position: sticky;
  z-index: 1;
  background-color: #fff;
  text-transform: uppercase;
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

button[type="button"] {
  border: none;
  font-size: 15px;
}
button[type="button"]:disabled {
  color: #a0aabc;
}

.pagination-btn-control {
  color: #404f6f;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  background: none;
  cursor: pointer;
}
.pagination-btn-num {
  cursor: pointer;
  border: none;
  background: none;
  padding: 4px 8px;
  border-radius: 8px;
  color: #404f6f;
  transition: 0.3s;
}
.pagination-btn-num--active {
  background: #e3e8f0;
}
.pagination-btn-num--cursor-default {
  cursor: default;
}
.user-settings-btn {
  background: none;
  cursor: pointer;
  padding: 0;
}
</style>
