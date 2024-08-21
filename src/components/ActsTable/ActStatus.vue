<template>
  <div class="status">
    <div :class="['status-light', statusClass.className]"></div>
    <p class="status-text">{{ statusClass.text }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  status: {
    type: Number,
  },
});

const statusClass = computed(() => {
  const s = props.status;
  if (s === 1) {
    return {
      text: "Акт не подтвержден",
      className: "status-light--red",
    };
  }

  return {
    text: "Акт подтвержден",
    className: "status-light--success",
  };
});
</script>

<style lang="scss" scoped>
.status {
  display: flex;
  align-items: center;
  column-gap: 4px;

  p {
    margin: 0;
  }
}
.status-light {
  width: 8px;
  height: 8px;
  border-radius: 50%;

  &--red {
    background-color: $negative;
  }
  &--alert {
    background-color: $alert;
  }
  &--success {
    background-color: $accent;
  }
}
</style>
