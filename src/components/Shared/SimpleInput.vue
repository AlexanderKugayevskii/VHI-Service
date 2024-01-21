<template>
  <div class="input-field">
    <label class="input-label">
      <div class="input-label__wrapper">
        <span class="input-label__text">Клиент</span>
      </div>
      <div class="input-field__wrapper">
        <input
          type="text"
          placeholder="Введите имя и фамилию клиента"
          class="input-field__text-input"
          :value="modelValue"
          @input="onInput"
        />
      </div>
    </label>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import debounce from 'lodash/debounce';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  debounceTime: {
    type: [Number, String],
    default: 0,
  },
});
const emit = defineEmits(['update:modelValue']);

const debounceInput = ref(props.modelValue);

const debounceEmit = debounce((value) => {
  emit('update:modelValue', value);
}, props.debounceTime);

const onInput = (e) => {
  debounceInput.value = e.target.value;
  if (props.debounceTime > 0) {
    debounceEmit(debounceInput.value);
  } else {
    emit('update:modelValue', e.target.value);
  }
};

watch(
  () => props.debounceTime,
  (newVal) => {
    if (newVal > 0) {
      debounceEmit.cancel();
      debounceEmit = debounce((value) => {
        emit('update:modelValue', value);
      }, newVal);
    }
  }
);
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
    padding: 12px 16px;
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
