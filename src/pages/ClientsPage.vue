<template>
  <q-page class="flex flex-center column body-bg" v-if="!isClientInfoRoute">
    <div class="col page-container clients-container">
      <h2 class="page-title q-my-none q-mb-md">
        {{ $t("nav.clients") }}
      </h2>
      <FullClientsTable
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
      />
    </div>
  </q-page>

  <RouterView />
</template>

<script setup>
import FullClientsTable from "src/components/ClientsTable/FullClientsTable.vue";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useFullClientTableStore } from "src/stores/allClientTableStore";

const clientTableStore = useFullClientTableStore();
const { pagination, rows, columns, loading, filterData } = storeToRefs(clientTableStore);

const route = useRoute();
const isClientInfoRoute = computed(() => route.name === "clientInfo");
</script>

<style lang="scss">
.clients-container {
  width: 100% !important;
}
</style>
