<template>
  <div class="filter-chip q-py-xs q-px-sm" :class="{ active: hoverable }">
    <div>
      <span class="filter-chip-type">{{ filterOption.label }}: </span>
      <span class="filter-chip-value">{{ filterOption.value }}</span>
    </div>
    <button type="button" class="filter-chip-delete-btn">
      <q-icon size="20px">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 5L5 15"
            stroke="#7A88A6"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M5 5L15 15"
            stroke="#7A88A6"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </q-icon>
    </button>
  </div>
</template>

<script setup>
defineProps({
  filterOption: {
    type: Object,
    required: true,
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.filter-chip {
  user-select: none;
  background-color: #fff;
  border-radius: 50px;
  color: #404f6f;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 8px;
  white-space: nowrap;
  transition: 0.3s;

  &-type {
  }
  &-value {
    font-weight: 600;
  }
  &-delete-btn {
    // width: 20px;
    // height: 20px;
    // padding: 5px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    transition: 0.3s;

    :hover {
      border-radius: 50%;
      background: $lightgray;
    }
  }
}
.filter-chip.active:hover {
  background-color: $lightgray;
}
</style>
