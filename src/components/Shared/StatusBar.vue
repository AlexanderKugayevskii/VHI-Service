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
import { useI18n } from "vue-i18n";
const props = defineProps({
  status: {
    type: Number,
    default: 0,
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

const { t } = useI18n();

const statuses = {
  '0': t("statuses.new"),
  '1': t("statuses.in_progress"),
  '2': t("statuses.completed"),
};
const statusArr = computed(() => {
  return Object.entries(statuses);
});
const findIndex = computed(() => {
  return statusArr.value.findIndex((item) => {
    return item[0] === String(props.status);
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
