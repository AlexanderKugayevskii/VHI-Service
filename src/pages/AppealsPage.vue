<template>
  <q-page class="flex body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Клиники</h2>
      <AppealsTable @createAppeal="openSearchClient" />
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
import { ref, onMounted } from "vue";
import AppealsTable from "src/components/ClientsTable/AppealsTable.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import FilterChip from "src/components/Shared/FilterChip.vue";
import TableFiltersModal from "components/ClientsTable/TableFiltersModal.vue";
import AppealSearchClient from "./AppealSearchClient.vue";
import AppealType from "./AppealType.vue";
import CreateAppeal from "./CreateAppealPage.vue";
// const props = defineProps(["page", "perPage"])
// const page = computed(() => props.page);

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
:global(.appeals-btn) {
  border-radius: 16px;
  border: none;
  background-color: #13b8ba;
  color: #fff;
  font-size: 15px;
  height: 44px;
  padding: 0 32px;
  font-weight: 500;
  cursor: pointer;
}

:deep(.q-field--dense .q-field__prepend) {
  padding-right: 8px;
}
</style>
