<template>
  <div class="selected-item">
    <div class="selected-item-left">
      <div class="selected-item-label">
        <slot name="label"></slot>
      </div>
    </div>
    <div class="selected-item-right">
      <div class="selected-item-price"><slot name="price"></slot></div>
      <div class="selected-item-actions">
        <button
          type="button"
          class="selected-item-btn"
          @click="emitClick($event, item)"
        >
          <q-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M11 1L1 11"
                stroke="#B8C2D1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 1L11 11"
                stroke="#B8C2D1"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </q-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import formatPrice from "src/helpers/formatPrice";
const props = defineProps({
  item: {
    type: Object,
  },
});

const emit = defineEmits(["update:remove"]);
const emitClick = (event, item) => {
  emit("update:remove", item);
};
</script>

<style scoped>
.selected-item {
  background-color: #f7f9fc;
  padding: 10px 16px;
  border-radius: 16px;
  display: flex;
  column-gap: 16px;
  margin-bottom: 8px;
}
.selected-item-left {
  flex-grow: 1;
}
.selected-item-label {
  color: #404f6f;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
}
.selected-item-right {
  display: flex;
  column-gap: 16px;
}
.selected-item-price {
  white-space: nowrap;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
}
.selected-item-btn {
  border: none;
  background: none;
  cursor: pointer;
}
</style>
