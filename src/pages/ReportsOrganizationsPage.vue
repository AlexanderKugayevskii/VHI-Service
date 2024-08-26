<template>
  <q-page class="flex column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Отчеты по аптекам</h2>
      <div class="">
        <!-- <ReportsByDate /> -->
        <OrganizationsTable />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ReportsByDate from "src/components/ReportsByDate.vue";
import OrganizationsTable from "src/components/ClientsTable/OrganizationsTable.vue";
</script>

<style scoped lang="scss"></style>
