<template>
  <div class="checkbox-wrapper">
    <label class="checkbox-label">
      <input
        type="checkbox"
        class="checkbox-input"
        :name="name"
        :checked="checked"
        @change="emitChange"
      />
      <q-icon size="16px" class="check-icon" v-if="variant">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="14"
          viewBox="0 0 15 12"
          fill="none"
        >
          <path
            d="M1.1665 5.99992L5.33317 10.1666L13.6665 1.83325"
            :stroke="checked ? '#13b8ba' : '#B8C2D1'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </q-icon>
      <q-icon size="16px" class="check-icon" v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M11 1L1 11"
            :stroke="checked ? '#DF7878' : '#B8C2D1'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M1 1L11 11"
            :stroke="checked ? '#DF7878' : '#B8C2D1'"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </q-icon>
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: Boolean,
    default: true,
  },
  name: {
    type: String,
  },
  checked: {
    type: Boolean,
  },
});

const emit = defineEmits(["change"]);

const emitChange = (event) => {
  const statusID = props.variant ? 1 : 2;

  if (event.target.checked) {
    emit("change", statusID);
  } else {
    emit("change", 0);
  }
};
</script>

<style lang="scss" scoped>
.checkbox-label {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
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

.check-icon svg path {
  transition: 0.3s;
}

.checkbox-label--checked {
  background-color: #13b8ba;
}
</style>
