<template>
  <div class="button-wrapper">
    <button
      :type="type"
      @click="handleClick"
      :class="customClass"
      :disabled="disabled"
    >
      <span v-if="!loading">
        {{ label }}
      </span>
      <slot name="loading-spinner" v-else></slot>
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
});
const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>

<style></style>
