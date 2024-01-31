<template>
  <div :class="['status-row', dense && 'status-row-dense']">
    <div
      :class="['status-item', index <= findIndex && 'status-done']"
      v-for="(item, index) in statusArr"
      :key="index"
    >
      {{ label ? item[1] : "" }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  status: {
    type: String,
    default: "IN_PROGRESS",
  },
  label: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
});

const statuses = {
  NEW: "Новое",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершено",
};
const statusArr = computed(() => {
  return Object.entries(statuses);
});
const findIndex = computed(() => {
  return statusArr.value.findIndex((item) => {
    return item[0].toLowerCase() === props.status.toLowerCase();
  });
});
</script>

<style lang="scss" scoped>
.status-row {
  column-gap: 1px;
  height: 24px;
  background-color: #edf0f5;
  border-radius: 50px;
  overflow: hidden;
  display: flex;

  &-dense {
    height: 8px;
  }
}

.status-item {
  font-size: 15px;
  font-weight: 500;
  color: #7a88a6;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-grow: 1;
}

.status-done {
  color: #ecffff;
  background-color: #13b8ba;
}
</style>
