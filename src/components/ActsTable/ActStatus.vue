<template>
  <div class="status">
    <div :class="['status-light', statusClass.className]"></div>
    <p class="status-text">{{ statusClass.text }}</p>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const props = defineProps({
  status: {
    type: Number,
  },
});

const { t } = useI18n();

const statusClass = computed(() => {
  const s = props.status;
  if (s === 1) {
    return {
      text: t("act.act_not_confirmed"),
      className: "status-light--red",
    };
  }

  return {
    text: t("act.act_confirmed"),
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
