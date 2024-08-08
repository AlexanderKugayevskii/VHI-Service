<template>
  <div class="reports">
    <VueDatePicker
      locale="ru"
      v-model="startDate"
      :flow="datePickerFlow"
      auto-apply
      partial-flow
      :enable-time-picker="false"
      :format="'yyyy-MM-dd'"
      placeholder="Дата акта"
    />
    <VueDatePicker
      locale="ru"
      v-model="endDate"
      :flow="datePickerFlow"
      auto-apply
      partial-flow
      :enable-time-picker="false"
      :format="'yyyy-MM-dd'"
      placeholder="Дата ЕСФ"
    />
    <SimpleButton
      :disabled="disableButtonIfEmptyDate"
      :label="buttonName"
      custom-class="appeals-btn"
      @click="handleClick"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";

import DateInput_new from "../Shared/DateInput_new.vue";
import SimpleButton from "../Shared/SimpleButton.vue";
import VueDatePicker from "@vuepic/vue-datepicker";
const props = defineProps({
  buttonName: {
    type: String,
    default: "Поиск",
  },
});
const emit = defineEmits(["getRange", "getData"]);

const datePickerFlow = ref(["year", "month", "calendar"]);
const startDate = ref("");
const endDate = ref("");

const formattedStartDate = computed(() => {
  if (startDate.value === "") {
    return "";
  }
  return dayjs(startDate.value).format("YYYY-MM-DD");
});

const formattedEndDate = computed(() => {
  if (endDate.value === "") {
    return "";
  }
  return dayjs(endDate.value).format("YYYY-MM-DD");
});

const disableButtonIfEmptyDate = computed(() => {
  return formattedStartDate.value === "" || formattedEndDate.value === "";
});

const handleClick = () => {
  emit("getData");
};

watch([formattedStartDate, formattedEndDate], () => {
  emit("getRange", {
    aktDate: formattedStartDate.value,
    esfDate: formattedEndDate.value,
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
