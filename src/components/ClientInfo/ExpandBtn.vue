<template>
  <div class="expand">
    <button type="button" @click="handleExpand">
      <span>{{ text }}</span>
      <q-icon size="20px">
        <svg
          :class="{ 'expand-icon': expand }"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="#404F6F"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </q-icon>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: "Свернуть",
  },
  expand: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["btn-click"]);

const handleExpand = () => {
  emit("btn-click");
};
</script>

<style lang="scss" scoped>
.expand-icon {
  transform: rotate(180deg);
}

.expand {
  display: flex;
  justify-content: center;
  padding: 12px 32px;

  button {
    padding: 0;
    color: #2c3955;
    font-size: 15px;
    border: none;
    background: none;
    outline: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    column-gap: 4px;
  }
}
</style>
