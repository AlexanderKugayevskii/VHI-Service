<template>
  <div :class="['client-tab', { selected: isSelected }]">
    {{ clientName }}
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  isSelected: {
    type: Boolean,
    default: false,
  },
  client: {
    type: Object,
    default: () => {},
  },
});

const client = computed(() => props.client);
const clientName = computed(() => {
  const firstname =
    client.value?.name[0].toUpperCase() +
    client.value?.name.slice(1).toLowerCase();
  const lastname =
    client.value?.lastname[0].toUpperCase() +
    client.value?.lastname.slice(1).toLowerCase();

  return lastname + " " + firstname;
});
</script>

<style scoped lang="scss">
.client-tab {
  padding: 8px 16px;
  color: $primary;
  border-radius: 250px;
  background: #f7f9fc;
  font-size: 15px;
  border: 1px solid#FFF;
  line-height: 20px;
  cursor: pointer;

  &.selected {
    border: 1px solid transparent;
    color: #fff;
    background: linear-gradient(
      107deg,
      #3acfd1 0%,
      #54bedd 51.04%,
      #6dade8 99.48%
    );
  }
}
</style>
