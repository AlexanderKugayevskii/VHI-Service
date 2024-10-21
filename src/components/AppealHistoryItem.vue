<template>
  <div class="history-item">
    <div class="history-item-heading">
      <div
        :class="[
          'history-item-status',
          `history-item-status_${classNameByStatus}`,
        ]"
      >
        {{ status }}
      </div>
      <div class="history-item-date">{{ date }}</div>
    </div>
    <div class="history-item-body">
      <span class="history-item-action-message"
        >{{ actionMessage.action }}:
      </span>
      <span class="history-item-action-username">{{
        actionMessage.username
      }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useHistory } from "src/composables/useHistory";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const { getStatus, getFormatDate, getActionMessage } = useHistory();

const status = computed(() => {
  return getStatus(props.item.action);
});

const date = computed(() => {
  return getFormatDate(props.item.created_at);
});

const actionMessage = computed(() => {
  return getActionMessage(props.item);
});

const classNameByStatus = computed(() => {
  const initStatus = actionMessage.value.initStatus;
  console.log(initStatus);
  if (initStatus === "created") {
    return "green";
  } else if (initStatus === "updated" || initStatus === "deleted") {
    return "red";
  } else {
    return "gray";
  }
});
</script>

<style lang="scss" scoped>
.history-item {
  display: flex;
  flex-direction: column;
  row-gap: 8px;

  &-heading {
    display: flex;
    column-gap: 12px;
    align-items: center;
  }

  &-status {
    display: flex;
    padding: var(--spacing-2, 8px) var(--spacing-3, 12px);
    align-items: center;
    gap: 10px;
    border-radius: var(--radius-full, 250px);
    font-size: 15px;
    line-height: 20px;

    &_gray {
      background: #f2f5fa;
      color: #404f6f;
    }
    &_red {
      background: #ffecec;
      color: #b22d2d;
    }
    &_green {
      background: #e0fafb;
      color: #404f6f;
    }
  }

  &-date {
    color: var(--color-dark-blue-300, #7a88a6);
    text-align: justify;
    /* body/regular */
    font-size: 15px;
    line-height: 20px; /* 133.333% */
  }

  &-action-message {
    color: #7a88a6;
    font-size: 15px;
  }
  &-action-username {
    color: #404f6f;
  }
}
</style>
