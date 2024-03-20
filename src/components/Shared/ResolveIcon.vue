<template>
  <div class="checkbox-wrapper">
    <label :class="['checkbox-label', { disabled: disabled }]">
      <input
        type="checkbox"
        class="checkbox-input"
        :name="name"
        :checked="checked"
        :disabled="disabled"
        @change="emitChange"
      />
      <q-icon size="20px" class="check-icon" v-if="variant">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.99984 18.9587C5.05229 18.9587 1.0415 14.9479 1.0415 10.0003C1.0415 5.05278 5.05229 1.04199 9.99984 1.04199C14.9474 1.04199 18.9582 5.05278 18.9582 10.0003C18.9582 14.9479 14.9474 18.9587 9.99984 18.9587ZM13.7332 7.81496C14.1369 7.59413 14.2853 7.08777 14.0644 6.68398C13.8436 6.28018 13.3373 6.13184 12.9335 6.35268C11.4096 7.18604 10.1495 8.79441 9.30225 10.0917C8.98917 10.5712 8.72167 11.0251 8.50767 11.4096C8.30804 11.2159 8.11032 11.0478 7.93349 10.908C7.70209 10.7251 7.49385 10.5807 7.34203 10.4813L7.0795 10.3182C6.67971 10.0902 6.17078 10.2295 5.94277 10.6293C5.71481 11.029 5.85395 11.5377 6.25352 11.7659L6.42876 11.8755C6.54777 11.9534 6.71454 12.0689 6.89981 12.2154C7.28111 12.5168 7.69255 12.912 7.95149 13.3449C8.1104 13.6106 8.4035 13.7662 8.71259 13.7492C9.02159 13.7322 9.29575 13.545 9.4245 13.2636L9.50642 13.0924C9.56284 12.9771 9.64734 12.8084 9.75734 12.6007C9.97775 12.1842 10.2983 11.6147 10.6977 11.003C11.5172 9.74824 12.5903 8.43991 13.7332 7.81496Z"
            :fill="checked ? '#13B8BA' : '#B8C2D1'"
          />
        </svg>
      </q-icon>
      <q-icon size="20px" class="check-icon" v-else>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10.2001 18.9587C5.45045 18.9587 1.6001 14.9479 1.6001 10.0003C1.6001 5.05278 5.45045 1.04199 10.2001 1.04199C14.9498 1.04199 18.8001 5.05278 18.8001 10.0003C18.8001 14.9479 14.9498 18.9587 10.2001 18.9587ZM13.1658 8.0896C13.4782 7.76418 13.4782 7.23653 13.1658 6.91109C12.8534 6.58564 12.3469 6.58563 12.0344 6.91105L10.1999 8.82183L8.36578 6.91138C8.0533 6.58595 7.5468 6.58597 7.23439 6.91142C6.92199 7.23687 6.922 7.7645 7.23443 8.08993L9.0685 10.0003L7.23443 11.9107C6.922 12.2362 6.92199 12.7638 7.23439 13.0892C7.5468 13.4147 8.0533 13.4147 8.36578 13.0892L10.1999 11.1788L12.0344 13.0896C12.3469 13.415 12.8534 13.415 13.1658 13.0896C13.4782 12.7641 13.4782 12.2365 13.1658 11.9111L11.3314 10.0003L13.1658 8.0896Z"
            :fill="checked ? '#DF7878' : '#B8C2D1'"
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
  disabled: {
    type: Boolean,
    default: false,
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

  &.disabled {
    opacity: 0.5 !important;
    cursor: not-allowed;
  }
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
