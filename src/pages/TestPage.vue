<template>
  <q-page class="flex body-bg">
    <div class="col page-container">
      <DetailInfoGroup />
      <!-- {{ formattedToday }}
      {{ formattedYesterday }} -->
      {{ today }}
      <br />
      {{ yesterday }}
    </div>
  </q-page>
</template>

<script setup>
import Trans from "src/i18n/translation";
import DetailInfoGroup from "src/components/ClientInfo/DetailInfoGroup.vue";
import useDay from "src/composables/useDay";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const { today, yesterday } = useDay();
</script>
<style lang="scss" scoped></style>
