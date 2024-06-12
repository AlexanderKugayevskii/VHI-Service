<template>
  <div class="checkbox-wrapper">
    <label
      class="checkbox-label"
      :class="{
        'checkbox-label--checked': checked,
      }"
    >
      <input
        type="checkbox"
        class="checkbox-input"
        :name="name"
        :value="item"
        :checked="checked"
        :disabled="disabled"
        @change="emitChange"
      />
      <q-icon size="16px" class="check-icon" v-if="checked">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
        >
          <path
            d="M12.3333 1.5L4.99999 8.83333L1.66666 5.5"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </q-icon>
      <slot name="text"></slot>
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
  },
  name: {
    type: String,
  },
  checked: {
    type: Boolean,
  },
  disabled: {
    type: Boolean,
  },
  
});

const emit = defineEmits(["change"]);

const emitChange = (event) => {
  if (event.target.checked) {
    emit("change", props.item);
  } else {
    emit("change", null);
  }
};
</script>

<style lang="scss" scoped>
.checkbox-label {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #d0d8e5;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.checkbox-input {
  position: absolute;
  left: 0;
  top: 0;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  width: 100%;
  height: 100%;
}
.check-icon {
  pointer-events: none;
}
// .checkbox-input:checked + .check-icon {
//   display: inline-block;
// }
.checkbox-label--checked {
  background-color: #13b8ba;
}
</style>
