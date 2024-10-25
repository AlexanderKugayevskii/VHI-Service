<template>
  <div class="history-wrapper">
    <div class="history-item-badge"></div>
    <div class="history-item">
      <div class="history-item-heading">
        <div
          :class="[
            'history-item-status',
            `history-item-status_${classNameByStatus}`,
          ]"
        >
          {{ $t(status) }}
        </div>
        <div class="history-item-date">{{ date }}</div>
      </div>
      <div class="history-item-body">
        <div class="history-item-body-item">
          <span class="history-item-action-message"
            >{{ $t(actionMessage.action) }}:
          </span>
          <span class="history-item-action-username">{{
            actionMessage.username
          }}</span>
        </div>
        <div
          class="history-item-body-item"
          v-if="actionMessage.whatChanged !== null"
        >
          <span class="history-item-action-message"
            >{{ $t(actionMessage.whatChanged.type) }}:
          </span>
          <span
            :class="[
              'history-item-action-username',
              { 'history-item-action-username_underline': underline },
            ]"
            ref="actionMessageRef"
            >{{ actionMessage.whatChanged.name }}
            <TableTooltip :offset="[0, -30]" :size="400">
              {{ actionMessage.whatChanged.name }}
            </TableTooltip></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useHistory } from "src/composables/useHistory";
import TableTooltip from "./Shared/TableTooltip.vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const { getStatus, getFormatDate, getActionMessage } = useHistory(props.item);

const actionMessageRef = ref(null);

const status = computed(() => {
  return getStatus(props.item);
});

const date = computed(() => {
  return getFormatDate(props.item.created_at);
});

const actionMessage = computed(() => {
  return getActionMessage(props.item);
});

const classNameByStatus = computed(() => {
  const initStatus = actionMessage.value.initStatus;

  if (props.item.action === "application_created" || initStatus === "closed") {
    return "green";
  } else if (initStatus === "updated" || initStatus === "deleted") {
    return "red";
  } else {
    return "gray";
  }
});

const underline = ref(false);
onMounted(() => {
  if (actionMessageRef.value) {
    if (
      actionMessageRef.value.scrollHeight >=
      actionMessageRef.value.offsetHeight +
        actionMessageRef.value.offsetHeight * 0.15
    ) {
      underline.value = true;
    }
  }
});
</script>

<style lang="scss" scoped>
.history-wrapper {
  position: relative;
  display: flex;
  margin-left: 4px;
  column-gap: 12px;
  width: 100%;
  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 18px;
    width: 1px;
    height: 100%;
    background-color: #e3e8f0;
  }
}
.history-item-badge {
  position: sticky;
  top: 8px;
  min-width: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e3e8f0;
  margin-left: -4px;
  margin-top: 16px;
}

.history-wrapper:last-of-type {
  &::before {
    height: calc(100% - 18px);
  }
}
.history-wrapper:last-of-type .history-item {
  padding-bottom: 0;
}
.history-item {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  padding-bottom: 12px;
  font-size: 15px;

  &-heading {
    display: flex;
    column-gap: 12px;
    align-items: center;
  }

  &-body {
    display: flex;
    flex-direction: column;
    row-gap: 8px;

    &-item {
      display: inline-flex;
      align-items: flex-start;
      column-gap: 0.5ch;
    }
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
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;

    &_underline {
      text-decoration: 1px dotted underline;
    }
  }
}
</style>
