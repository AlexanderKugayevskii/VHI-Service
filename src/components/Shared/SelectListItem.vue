<template>
  <div class="selected-item">
    <div class="selected-item-left">
      <slot name="title"> Имя врача </slot>
    </div>
    <div class="selected-item-right">
      <div class="selected-item-price">{{ item.price }} UZS</div>
      <div class="selected-item-actions">
        <slot name="confirm-action"> </slot>
        <slot name="remove-action">
          <div class="checkbox-wrapper">
            <button type="button" @click="removeItem($event, item)">
              <q-icon size="20px">
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
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  item: {
    type: Object,
  },
  name: {
    type: String,
  },
});

const emit = defineEmits(["update:remove"]);
const removeItem = (event, item) => {
  emit("update:remove", item);
};
</script>

<style lang="scss" scoped>
.selected-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  border-radius: 16px;
  background-color: #f7f9fc;
  padding: 10px 16px;
  margin-bottom: 8px;
}
.selected-item-left {
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
}
.selected-item-right {
  display: flex;
  column-gap: 16px;
}
.selected-item-price {
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
}
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
</style>
