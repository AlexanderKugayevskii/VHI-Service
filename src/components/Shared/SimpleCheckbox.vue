<template>
  <div class="checkbox-wrapper">
    <label class="checkbox-label">
      <input type="checkbox" class="checkbox-input" :value="item" />
      <q-icon size="16px" class="check-icon">
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
    </label>
  </div>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
  },
});

const selectItem = (item) => {
  emit("update:selectItems", item);
};

const emit = defineEmits(["update:selectItems"]);
</script>

<style lang="scss" scoped>
.checkbox-label {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: grey;
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
  display: none;
}
.checkbox-input:checked + .check-icon {
  display: inline-block;
}
</style>
