<template>
  <div class="input-field">
    <label class="input-label">
      <div class="input-label__wrapper">
<<<<<<< HEAD
        <span class="input-label__text">Клиент</span>
=======
        <span class="input-label__text">{{ label }}</span>
>>>>>>> e0875ea (some changes)
      </div>
      <div class="input-field__wrapper">
        <input
          type="text"
<<<<<<< HEAD
          placeholder="Введите имя и фамилию клиента"
=======
          :placeholder="placeholder"
>>>>>>> e0875ea (some changes)
          class="input-field__text-input"
          :value="modelValue"
          @input="onInput"
        />
<<<<<<< HEAD
=======
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
>>>>>>> e0875ea (some changes)
      </div>
    </label>
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { ref, watch } from 'vue';
import debounce from 'lodash/debounce';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
=======
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
>>>>>>> e0875ea (some changes)
  },
  debounceTime: {
    type: [Number, String],
    default: 0,
  },
<<<<<<< HEAD
});
const emit = defineEmits(['update:modelValue']);
=======
  showIcon: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);
>>>>>>> e0875ea (some changes)

const debounceInput = ref(props.modelValue);

const debounceEmit = debounce((value) => {
<<<<<<< HEAD
  emit('update:modelValue', value);
=======
  emit("update:modelValue", value);
>>>>>>> e0875ea (some changes)
}, props.debounceTime);

const onInput = (e) => {
  debounceInput.value = e.target.value;
  if (props.debounceTime > 0) {
    debounceEmit(debounceInput.value);
  } else {
<<<<<<< HEAD
    emit('update:modelValue', e.target.value);
=======
    emit("update:modelValue", e.target.value);
>>>>>>> e0875ea (some changes)
  }
};

watch(
  () => props.debounceTime,
  (newVal) => {
    if (newVal > 0) {
      debounceEmit.cancel();
      debounceEmit = debounce((value) => {
<<<<<<< HEAD
        emit('update:modelValue', value);
=======
        emit("update:modelValue", value);
>>>>>>> e0875ea (some changes)
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
<<<<<<< HEAD
=======
    display: flex;
    align-items: center;
    justify-content: space-between;
>>>>>>> e0875ea (some changes)
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
