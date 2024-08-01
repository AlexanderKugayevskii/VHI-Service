<template>
  <div class="reports">
    <DateInput_new
      label="Дата акта"
      placeholder="01-01-2024"
      v-model="startDate"
    />
    <DateInput_new
      label="Дата ЭСФ"
      placeholder="01-01-2024"
      v-model="endDate"
    />
    <SimpleButton
      :disabled="disabledRule"
      :label="buttonName"
      custom-class="appeals-btn"
      @click="handleClick"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import DateInput_new from "../Shared/DateInput_new.vue";
import SimpleButton from "../Shared/SimpleButton.vue";
const props = defineProps({
  disabledRule: {
    type: Boolean,
  },
  buttonName: {
    type: String,
    default: "Поиск",
  },
});
const emit = defineEmits(["getRange", "getData"]);

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

const handleClick = () => {
  emit("getData");
};

watch([startDate, endDate], () => {
  emit("getRange", {
    aktDate: startDate.value,
    esfDate: endDate.value,
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
