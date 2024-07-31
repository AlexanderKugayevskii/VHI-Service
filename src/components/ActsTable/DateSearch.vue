<template>
  <div class="reports">
    <DateInput_new label="Дата" placeholder="01-01-2024" v-model="endDate" />
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

const endDate = ref("");

const checkActiveButton = computed(() => {
  const dateLength = 10;
  const currentYear = new Date().getFullYear();
  const [endDay, endMonth, endYear] = endDate.value.split("-");

  if (Number(endYear) > currentYear) {
    return true;
  }
  if (Number(endDay) > 31) {
    return true;
  }
  if (Number(endMonth) > 12) {
    return true;
  }
  if (endDate.value.length !== dateLength) {
    return true;
  }

  return false;
});

const handleClick = () => {
  emit("getData");
};

watch([endDate], () => {
  emit("getRange", {
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
