<template>
  <div class="selected-item-row">
    <div class="selected-item">
      <div class="selected-item-left">
        <div class="selected-item-label">
          <slot name="label"></slot>
        </div>
      </div>
      <div class="selected-item-right">
        <slot name="dropdown"></slot>

        <StatusSwitcher
          :isAgent="isAgent"
          :progress="item.pivot.progress"
          v-if="item.pivot.status === 1 && showProgressSwitcher"
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
    <button
      v-if="removable"
      type="button"
      class="selected-item-remove-btn"
      @click="removeItem"
      :disabled="cantRemoveItem"
    >
      <q-icon size="16px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M12.6664 3H1.33301"
            stroke="#D0D8E6"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M11.5555 4.66675L11.2488 9.26615C11.1308 11.0361 11.0718 11.9211 10.4951 12.4605C9.91847 13.0001 9.03154 13.0001 7.25767 13.0001H6.74214C4.96824 13.0001 4.0813 13.0001 3.50463 12.4605C2.92796 11.9211 2.86896 11.0361 2.75096 9.26615L2.44434 4.66675"
            stroke="#D0D8E6"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M3.33301 3C3.37026 3 3.38889 3 3.40577 2.99957C3.95473 2.98566 4.43902 2.63661 4.62582 2.12021C4.63157 2.10433 4.63745 2.08666 4.64923 2.05131L4.71396 1.85714C4.76921 1.69139 4.79684 1.60851 4.83348 1.53813C4.97968 1.25738 5.25017 1.06243 5.56275 1.01251C5.64109 1 5.72847 1 5.90321 1H8.09614C8.27087 1 8.35827 1 8.43661 1.01251C8.74921 1.06243 9.01967 1.25738 9.16587 1.53813C9.20254 1.60851 9.23014 1.69139 9.28541 1.85714L9.35014 2.05131C9.36187 2.08661 9.36781 2.10434 9.37354 2.12021C9.56034 2.63661 10.0446 2.98566 10.5936 2.99957C10.6105 3 10.6291 3 10.6663 3"
            stroke="#D0D8E6"
            stroke-width="1.5"
          />
        </svg>
      </q-icon>
    </button>
    <SimpleInput
      v-if="hasQuantity"
      :disableInput="disableQuantity"
      style="width: 10ch"
      placeholder="кол-во"
      number
      :model-value="quantity"
      @update:model-value="handleQuantity"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import ResolveIcon from "./ResolveIcon.vue";
import StatusSwitcher from "./StatusSwitcher.vue";
import DropdownSelectNew from "./DropdownSelectNew.vue";
import SimpleInput from "./SimpleInput.vue";

const props = defineProps({
  item: {
    type: Object,
  },
  isAgent: {
    type: Boolean,
  },
  removable: {
    type: Boolean,
    default: false,
  },
  showProgressSwitcher: {
    type: Boolean,
    default: true,
  },
  allowHandleStatus: {
    type: Boolean,
    default: true,
  },
  disableQuantity: {
    type: Boolean,
    default: false,
  },
  hasQuantity: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  "update:status",
  "update:progress",
  "update:quantity",
  "remove:item",
]);

const disabledRule = computed(() => {
  const createdByOther =
    props.item.pivot.created_by_clinic ?? props.item.pivot.created_by_drugstore;

  return (
    !props.allowHandleStatus ||
    props.item.isNew ||
    props.item.pivot.progress >= 1 ||
    (!props.isAgent &&
      props.item.pivot.status !== 0 &&
      props.item.pivot.progress >= 1 &&
      createdByOther === 0) ||
    (props.isAgent && createdByOther === 0 && props.item.pivot.status === 0) ||
    (!props.isAgent && createdByOther === 1 && props.item.pivot.status >= 0)
  );
});

const cantRemoveItem = computed(() => {
  return props.item.pivot.status > 0;
});

const quantity = computed(() => String(props.item.pivot.quantity));

const handleStatus = (status) => {
  emit("update:status", { status, item: props.item });
};
const handleProgress = (progress) => {
  emit("update:progress", { progress, item: props.item });
};
const handleQuantity = (quantity) => {
  emit("update:quantity", { quantity: Number(quantity), item: props.item });
};

const removeItem = () => {
  emit("remove:item", props.item);
};
</script>

<style lang="scss" scoped>
.selected-item-row {
  display: flex;
  align-items: center;
  column-gap: 4px;
  margin-bottom: 8px;
}
.selected-item {
  flex-grow: 1;
  background-color: #f7f9fc;
  padding: 10px 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;

  column-gap: 16px;
}
.selected-item-left {
  // width: 450px;
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
  // flex-grow: 1;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  column-gap: 16px;
}
.selected-item-price {
  // flex-grow: 1;
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
.selected-item-remove-btn {
  background: none;
  outline: none;
  cursor: pointer;
  border: none;
}
</style>
