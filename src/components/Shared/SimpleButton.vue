<template>
  <div class="button-wrapper">
    <button
      :type="type"
      @click="handleClick"
      :class="[customClass, { 'full-width': fullWidth }]"
      :disabled="disabled"
    >
      <span v-if="!loading">
        {{ label }}
      </span>
      <slot name="loading-spinner" v-else></slot>
      <slot name="tooltip"></slot>
      <slot></slot>
    </button>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  type: String,
  customClass: [Array, Object, String],
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["click"]);

const handleClick = (e) => {
  emit("click", e);
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
