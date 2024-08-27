<template>
  <div class="input-field">
    <label class="input-label">
      <div class="input-label__wrapper" v-if="label">
        <span class="input-label__text">{{ label }}</span>
      </div>
      <div
        :class="['input-field__wrapper', { error: isError }]"
        :style="wrapperStyle"
      >
        <textarea
          :disabled="disableInput"
          :placeholder="placeholder"
          class="input-field__text-input"
          :value="modelValue"
          @input="onInput"
        ></textarea>
      </div>
    </label>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import debounce from "lodash/debounce";

const props = defineProps({
  wrapperStyle: {},
  maxlength: {
    type: [String, Number],
  },
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
  debounceTime: {
    type: [Number, String],
    default: 0,
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
  },
  number: {
    type: Boolean,
    default: false,
  },
  isError: {
    type: [Boolean, String],
    default: false,
  },
  disableInput: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const debounceInput = ref(props.modelValue);

const debounceEmit = debounce((value) => {
  emit("update:modelValue", value);
}, props.debounceTime);

const onInput = (e) => {
  if (props.number) {
    e.target.value = e.target.value.replace(/[^\d.]+|(?<=\..*)\./g, "");
  }
  debounceInput.value = e.target.value;

  if (props.debounceTime > 0) {
    debounceEmit(debounceInput.value);
  } else {
    emit("update:modelValue", e.target.value);
  }
};

watch(
  () => props.debounceTime,
  (newVal) => {
    if (newVal > 0) {
      debounceEmit.cancel();
      debounceEmit = debounce((value) => {
        emit("update:modelValue", value);
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
    min-height: 100px;
    outline: none;
    background: none;
    border: none;
    padding: 0;
    color: $primary;
    resize: vertical;
    &::placeholder {
      color: #7a88a6;
      font-size: 15px;
    }
  }
}
</style>
