<template>
  <q-page class="flex body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">{{$t('nav.clinics')}}</h2>
      <AppealsTable
        @createAppeal="openSearchClient"
        :pagination="pagination"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filterData="filterData"
        :requestData="clientTableStore.handleRequest"
        :select-filter-data="clientTableStore.selectFilterData"
        :filter-query="clientTableStore.filterQuery"
        :checkSelectedOption="clientTableStore.checkSelectedOption"
        :removeFilter="clientTableStore.removeFilter"
        :fetchClinics="clientTableStore.fetchClinics"
        :total="total"
      />
    </div>
    <AppealSearchClient
      v-model:="searchFilterFixed"
      @openTypeModal="openAppealTypeModal"
    ></AppealSearchClient>
    <AppealType
      v-model:="appealTypeFixed"
      @move-back="handleMoveBackToAppealSearch"
    />
    <router-view></router-view>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import AppealsTable from "src/components/ClientsTable/AppealsTable.vue";
import AppealSearchClient from "./AppealSearchClient.vue";
import AppealType from "./AppealType.vue";
// const props = defineProps(["page", "perPage"])
// const page = computed(() => props.page);
import { storeToRefs } from "pinia";
import { useClientTableStore } from "src/stores/clientTableStore";
import { useQuasar } from "quasar";

const $q = useQuasar();
// onBeforeRouteLeave((to, from, next) => {
//   // previusRoute.value = from;
//   console.log(from.fullPath);

//   $q.sessionStorage.set("previuos", from.fullPath);
//   next();
// });

const clientTableStore = useClientTableStore();
const { pagination, rows, columns, loading, filterData, total } =
  storeToRefs(clientTableStore);

const searchFilterFixed = ref(false);
const appealTypeFixed = ref(false);

const handleMoveBackToAppealSearch = (val) => {
  searchFilterFixed.value = val;
};
const openSearchClient = () => {
  searchFilterFixed.value = true;
};
const openAppealTypeModal = (type) => {
  appealTypeFixed.value = type;
};
</script>

<style lang="scss" scoped>
:deep(.q-field--dense .q-field__prepend) {
  padding-right: 8px;
}
</style>
