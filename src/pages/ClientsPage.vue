<template>
  <q-page class="flex flex-center column body-bg" v-if="!isClientInfoRoute">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Клиенты</h2>
      <FullClientsTable />
    </div>
  </q-page>
  <RouterView />
</template>

<script setup>
import FullClientsTable from "src/components/ClientsTable/FullClientsTable.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isClientInfoRoute = computed(() => route.name === "clientInfo");
</script>

<style lang="scss"></style>
