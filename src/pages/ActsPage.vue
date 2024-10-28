<template>
  <q-page class="flex column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">{{ $t("nav.act_and_esf") }}</h2>
      <ActsTable />
    </div>
  </q-page>
</template>

<script setup>
import ActsTable from "src/components/ActsTable/ActsComponent.vue";
</script>
