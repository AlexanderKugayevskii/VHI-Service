<template>
  <q-page class="flex flex-center column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Отчеты по аптекам</h2>
      <DrugstoreDataTable />
    </div>
  </q-page>
</template>

<script setup>
import DrugstoreDataTable from "src/components/ClientsTable/DrugstoreDataTable.vue";
</script>

<style scoped lang="scss"></style>
