<template>
  <div class="selected-item">
    <div class="selected-item-left">
      <div class="selected-item-label">
        <slot name="label"></slot>
      </div>
    </div>
    <div class="selected-item-right">
      <StatusSwitcher
        :isAgent="isAgent"
        :progress="item.pivot.progress"
        v-if="item.pivot.status === 1"
        @update:change="handleProgress"
      />
      <div class="selected-item-quantity" v-if="$slots.quantity">
        <slot name="quantity"></slot>
      </div>
      <div class="selected-item-price" v-if="$slots.price">
        <slot name="price"></slot>
      </div>
      <div class="selected-item-actions">
        <ResolveIcon
          :variant="true"
          @change="handleStatus"
          :checked="item.pivot.status === 1"
          :disabled="disabledRule"
        />
        <ResolveIcon
          :variant="false"
          @change="handleStatus"
          :checked="item.pivot.status === 2"
          :disabled="disabledRule"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import ResolveIcon from "./ResolveIcon.vue";
import StatusSwitcher from "./StatusSwitcher.vue";

const props = defineProps({
  item: {
    type: Object,
  },
  isAgent: {
    type: Boolean,
  },
});

const emit = defineEmits(["update:status", "update:progress"]);

const disabledRule = computed(() => {
  return (
    props.item.isNew ||
    props.item.pivot.progress >= 1 ||
    (!props.isAgent &&
      props.item.pivot.status !== 0 &&
      props.item.pivot.progress >= 1 &&
      props.item.pivot.created_by_clinic === 0) ||
    (props.isAgent &&
      props.item.pivot.created_by_clinic === 0 &&
      props.item.pivot.status === 0) ||
    (!props.isAgent &&
      props.item.pivot.created_by_clinic === 1 &&
      props.item.pivot.status >= 0)
  );
});

const handleStatus = (status) => {
  emit("update:status", { status, item: props.item });
};
const handleProgress = (progress) => {
  emit("update:progress", { progress, item: props.item });
};
</script>

<style scoped>
.selected-item {
  background-color: #f7f9fc;
  padding: 10px 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
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
  align-items: center;
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
