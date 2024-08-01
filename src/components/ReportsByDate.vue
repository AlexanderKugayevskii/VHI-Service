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
      custom-class="appeals-btn"
      label="Сформировать отчет"
      :disabled="checkActiveButton"
      @click="downloadReport"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import ClinicService from "src/services/ClinicService";
import DateInput_new from "./Shared/DateInput_new.vue";
import SimpleButton from "./Shared/SimpleButton.vue";

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

const downloadReport = async () => {
  try {
    const response = await ClinicService.downloadOrganizationsExcel({
      startDate: startDate.value,
      endDate: endDate.value,
    });
    const blob = new Blob([response.data], { type: response.data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `report_by_organization.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
  } finally {
  }
};
</script>

<style scoped lang="scss">
.reports {
  display: flex;
  align-items: flex-end;
  column-gap: 20px;
}
</style>
