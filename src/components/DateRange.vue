<template>
  <div class="reports">
    <DateInput_new
      label="Дата начала"
      placeholder="01-01-2024"
      v-model="startDate"
    />
    <DateInput_new
      label="Дата конца"
      placeholder="01-01-2024"
      v-model="endDate"
    />
    <SimpleButton
      :disabled="disableButton"
      label="Скачать отчет"
      custom-class="appeals-btn reports-btn"
      @click="getExcelData(props.row)"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import DateInput_new from "./Shared/DateInput_new.vue";

const emit = defineEmits(["getRange"]);

const startDate = ref("");
const endDate = ref("");

const checkActiveButton = computed(() => {
  const dateLength = 10;
  const currentYear = new Date().getFullYear();
  const [startDay, startMonth, startYear] = startDate.value.split("-");
  const [endDay, endMonth, endYear] = endDate.value.split("-");

  if (Number(startYear) > currentYear || Number(endYear) > currentYear) {
    return true;
  }
  if (Number(startDay) > 31 || Number(endDay) > 31) {
    return true;
  }
  if (Number(startMonth) > 12 || Number(endMonth) > 12) {
    return true;
  }
  if (
    startDate.value.length !== dateLength ||
    endDate.value.length !== dateLength
  ) {
    return true;
  }

  return false;
});

watch([startDate, endDate], () => {
  emit("getRange", {
    startDate: startDate.value,
    endDate: endDate.value,
    checkActiveButton: checkActiveButton.value,
  });
});
</script>

<style scoped lang="scss">
.reports {
  display: flex;
  align-items: flex-end;
  column-gap: 20px;
}
</style>
