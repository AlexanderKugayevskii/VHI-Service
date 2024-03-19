<template>
  <div class="input-field">
    <label class="input-label">
      <div class="input-label__wrapper">
        <span class="input-label__text">{{ label }}</span>
      </div>
      <div class="input-field__container">
        <div class="input-field__wrapper short">
          <input
            ref="passportSeriaRef"
            :type="type"
            placeholder="AA"
            class="input-field__text-input uppercase"
            maxlength="2"
            @keyup="handlePassportSeriaKeyUp"
            @input="onSeriaInput"
          />
        </div>
        <div class="input-field__wrapper long">
          <input
            ref="passportNumberRef"
            :type="type"
            placeholder="0000000"
            class="input-field__text-input"
            maxlength="7"
            @keyup="handlePassportKeyUp"
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
      </div>
    </label>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
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

const passportSeria = ref("");
const passportNumber = ref("");

const passportNumberRef = ref(null);
const passportSeriaRef = ref(null);

const concatPassport = computed(
  () => `${passportSeria.value} ${passportNumber.value}`
);

const debounceEmit = debounce((value) => {
  emit("update:modelValue", value);
}, props.debounceTime);

const onSeriaInput = (e) => {
  e.target.value = e.target.value.replace(/[^A-Za-z]/g, "").toUpperCase();
  passportSeria.value = e.target.value;
  if (props.debounceTime > 0) {
    debounceEmit(concatPassport.value);
  } else {
    emit("update:modelValue", concatPassport.value);
  }
};

const handlePassportSeriaKeyUp = (e) => {
  if (e.target.value.length >= 2) {
    passportNumberRef.value.focus();
  }
};
const handlePassportKeyUp = (e) => {
  const backSpace = e.code === "Backspace";
  if (e.target.value.length === 0 && backSpace) {
    passportSeriaRef.value.focus();
  }
};

const onInput = (e) => {
  e.target.value = e.target.value.replace(/\D/, "");
  passportNumber.value = e.target.value;
  if (props.debounceTime > 0) {
    debounceEmit(concatPassport.value);
  } else {
    emit("update:modelValue", concatPassport.value);
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
  &__container {
    display: flex;
    column-gap: 8px;
  }
  &__wrapper {
    &.short {
      width: 60px;
    }
    &.long {
      flex-grow: 1;
    }
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
    &.uppercase {
      text-transform: uppercase;
      text-align: center;
    }
    &::placeholder {
      color: #7a88a6;
      font-size: 15px;
    }
  }
}
</style>
