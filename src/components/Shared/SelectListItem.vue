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
        <ResolveIcon
          :variant="true"
          @change="handleStatus"
          :checked="item.status === 1"
        />
        <ResolveIcon
          :variant="false"
          @change="handleStatus"
          :checked="item.status === 2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import ResolveIcon from "./ResolveIcon.vue";

const props = defineProps({
  item: {
    type: Object,
  },
});

const emit = defineEmits(["update:status"]);

const handleStatus = (status) => {
  emit("update:status", { status, item: props.item });
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
.selected-item-actions {
  display: flex;
  column-gap: 8px;
}
</style>
