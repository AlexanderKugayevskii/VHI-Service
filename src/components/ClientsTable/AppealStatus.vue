<template>
  <div class="flex status-row">
    <div
      class="status-left"
      :class="{
        'status-done': status === 'IN_PROGRESS' || status === 'COMPLETED',
      }"
    ></div>
    <div
      class="status-right"
      :class="{
        'status-done': status === 'COMPLETED',
      }"
    ></div>
  </div>
  <div class="status-outer-text" v-if="!showStatusText">
    <span class="status-text" v-if="status === 'NEW'">{{
      t("statuses.new")
    }}</span>
    <span class="status-text" v-else-if="status === 'IN_PROGRESS'">{{
      t("statuses.in_progress")
    }}</span>
    <span class="status-text" v-if="status === 'COMPLETED'">{{
      t("statuses.completed")
    }}</span>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
defineProps({
  status: {
    type: String,
    default: "NEW",
  },
  showStatusText: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();
</script>

<style lang="scss" scope>
.status-row {
  column-gap: 1px;
  height: 8px;
  background-color: #edf0f5;
  border-radius: 50px;
  margin-bottom: 4px;
}
.status-left {
  flex: 1;
  border-radius: 50px 0 0 50px;
}
.status-right {
  flex: 1;
  border-radius: 0 50px 50px 0;
}
.status-done {
  background-color: #13b8ba;
}
.status-text {
  font-size: 11px;
  color: #404f6f;
}
</style>
