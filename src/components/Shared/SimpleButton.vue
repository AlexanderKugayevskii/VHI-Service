<template>
  <div class="button-wrapper">
    <button
      :type="type"
      @click="handleClick"
      :class="customClass"
      :disabled="disabled"
    >
      {{ label }}
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
});
const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click");
};
</script>

<style></style>
