<template>
  <q-page class="flex body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Аптеки</h2>

      <DrugstoreTable
        @createAppeal="openSearchClient"
        :pagination="pagination"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :filterData="filterData"
        :request-data="drugTableStore.handleRequest"
        :select-filter-data="drugTableStore.selectFilterData"
        :filter-query="drugTableStore.filterQuery"
        :checkSelectedOption="drugTableStore.checkSelectedOption"
        :remove-filter="drugTableStore.removeFilter"
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
import DrugstoreTable from "src/components/ClientsTable/DrugstoreTable.vue";
import AppealSearchClient from "./AppealSearchClient.vue";
import AppealType from "./AppealType.vue";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";

import { useDrugTableStore } from "src/stores/drugTableStore";
import ClientsTable from "src/components/ClientsTable/ClientsTable.vue";

const drugTableStore = useDrugTableStore();

const { pagination, rows, columns, loading, filterData, total } =
  storeToRefs(drugTableStore);

const modalFilterFixed = ref(false);
const appealTypeFixed = ref(false);
const searchFilterFixed = ref(false);
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
.search-input {
  background-color: #fff;
  border-radius: 50px;
  width: 250px;
  font-size: 15px;
  color: #7a88a6;
}

.appeals-actions {
  padding-top: 4px;
  padding-bottom: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.appeals-filter {
  display: flex;
  column-gap: 8px;
}
.appeals-badges {
  display: flex;
  align-items: center;
  column-gap: 8px;
}
:deep(.q-field--dense .q-field__prepend) {
  padding-right: 8px;
}

.filter-badge {
  background-color: #fff;
  height: 36px;
  width: 36px;
  .q-badge {
    background-color: $accent;
    width: 17px;
    height: 17px;
    line-height: 17px;
    border-radius: 50%;
    font-size: 11px;
    justify-content: center;
    right: -4px;
    top: -5px;
  }
}

.filter-chip-dropdown {
  position: relative;

  &-content {
    z-index: 10;
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0px 0px 22px 0px #dae0eb;
  }

  &-btn {
    cursor: pointer;
    height: 36px;
    border: none;
    background: none;
    border-radius: 50px;
    background-color: #fff;
    color: #404f6f;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    &:hover {
      background-color: $lightgray;
    }
  }
}
</style>
