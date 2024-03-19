<template>
  <div class="input-field">
    <label class="input-label">
      <div class="input-label__wrapper">
        <span class="input-label__text">{{ label }}</span>
      </div>
      <div class="input-field__wrapper">
   
        <input
          :type="type"
          :placeholder="placeholder"
          class="input-field__text-input"
          :value="modelValue"
          @input="onInput"
        />
        <q-icon size="20px" v-if="showIcon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
          >
            <path
              d="M9.16671 15.5C12.3884 15.5 15 12.8884 15 9.66671C15 6.44505 12.3884 3.83337 9.16671 3.83337C5.94505 3.83337 3.33337 6.44505 3.33337 9.66671C3.33337 12.8884 5.94505 15.5 9.16671 15.5Z"
              stroke="#A0AABC"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16.6667 17.1667L13.3334 13.8334"
              stroke="#A0AABC"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </q-icon>
      </div>
    </label>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import debounce from "lodash/debounce";

const props = defineProps({
  label: {
    type: String,
    default: "Label",
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
});

const emit = defineEmits(["update:modelValue"]);

const debounceInput = ref(props.modelValue);

const debounceEmit = debounce((value) => {
  emit("update:modelValue", value);
}, props.debounceTime);

const onInput = (e) => {
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
    padding: 12px 16px;
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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
