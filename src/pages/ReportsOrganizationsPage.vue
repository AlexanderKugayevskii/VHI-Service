<template>
  <q-page class="flex column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Отчеты по аптекам</h2>
      <div class = "">
        <ReportsByDate />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ReportsByDate from "src/components/ReportsByDate.vue";
</script>

<style scoped lang="scss"></style>
