<template>
  <q-page class="flex column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Акт и ЭСФ</h2>
      <ActsTable />
    </div>
  </q-page>
</template>

<script setup>
import ActsTable from "src/components/ActsTable/ActsTable.vue";
</script>
