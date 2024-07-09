<template>
  <q-page class="flex flex-center column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Отчеты по клиникам</h2>
      <ClinicsTable />
    </div>
  </q-page>
</template>

<script setup>
import ClinicsTable from "src/components/ClientsTable/ClinicsTable.vue";

</script>

<style scoped lang="scss"></style>
