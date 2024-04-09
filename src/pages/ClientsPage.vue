<template>
  <q-page class="flex flex-center column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Клиенты</h2>

      <FullClientsTable />
    </div>
  </q-page>
</template>

<script setup>
import FullClientsTable from "src/components/ClientsTable/FullClientsTable.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
</script>

<style lang="scss"></style>
