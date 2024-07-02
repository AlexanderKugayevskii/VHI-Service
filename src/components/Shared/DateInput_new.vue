<template>
  <div class="input-field">
    <label class="input-label">
      <div class="input-label__wrapper" v-if="label">
        <span class="input-label__text">{{ label }}</span>
      </div>
      <div :class="['input-field__wrapper', { error: isError }]">
        <input
          v-maska:unmaskedValue.unmasked
          data-maska="##-##-####"
          data-maska-eager
          type="text"
          :placeholder="placeholder"
          class="input-field__text-input"
          v-model="maskedValue"
        />
      </div>
    </label>
  </div>
</template>

<script setup>
import { vMaska } from "maska/vue";
import { ref, watch } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Input placeholder",
  },
  modelValue: {
    type: String,
    default: "",
  },
  isError: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const maskedValue = ref(props.modelValue);
const unmaskedValue = ref("");

const updateModel = () => {
  emit("update:modelValue", maskedValue.value);
};

watch(maskedValue, updateModel);

defineExpose({ unmaskedValue });
</script>

<style lang="scss" scoped>
.input-label {
  display: block;
}
.input-label__wrapper {
  margin-bottom: 8px;
}
.input-label__text {
  color: #404f6f;
  font-size: 15px;
  line-height: 20px;
}
.input-field {
  width: 100%;
  &__wrapper {
    background-color: #f2f5fa;
    border-radius: 16px;
    border: 1px solid transparent;
    padding: 12px 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.error {
      border-color: #cb3333;
    }
  }
  &__text-input {
    width: 100%;
    outline: none;
    background: none;
    border: none;
    padding: 0;

    &::placeholder {
      color: #7a88a6;
      font-size: 15px;
    }
  }
}
</style>
