<template>
  <q-page class="flex column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Отчет оплаты</h2>
      <BillingTable />
    </div>
  </q-page>
</template>

<script setup>
import BillingTable from "src/components/ClientsTable/BillingTable.vue";
</script>

<style lang="scss" scoped></style>
