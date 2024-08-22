<template>
  <div class="notification-item" @click="open">
    <div class="notification-item-icon">
      <q-icon size="24px">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75ZM13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8V11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H11V16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16V13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H13V8Z"
            fill="#7A88A6"
          />
        </svg>
      </q-icon>
    </div>
    <div class="notification-item-content">
      <div class="notification-item-body">
        <div class="notification-item-message">
          <div class="notification-item-message__text">
            {{ message }}
            <!-- <span class="notification-item-message__owner">(Клиника)</span> -->
          </div>
          <div class="notification-item-status"></div>
        </div>
        <div class="notification-item-time">
          <!-- <span class="notification-item-time__left"> Создано в 14:30 </span>
          <span class="notification-item-time__right"> 3 мин назад </span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { computed, ref } from "vue";

const props = defineProps({
  notification: {
    type: Object,
  },
});
const emit = defineEmits(["open"]);

const types = {
  PROGRESS_ACTION_REQUIRED: "PROGRESS_ACTION_REQUIRED",
  STATUS_ACTION_REQUIRED: "STATUS_ACTION_REQUIRED",
};

const open = () => {
  emit("open", props.notification.application_id);
};

onMounted(() => {
  // console.log(props.notification);
});

const message = computed(() => {
  let msg = `Обращение № ${props.notification.application_id} требует обновления `;

  switch (props.notification.notification_type) {
    case types.PROGRESS_ACTION_REQUIRED: {
      msg += "прогреса";
      return msg;
    }
    case types.STATUS_ACTION_REQUIRED: {
      msg += "статуса";
      return msg;
    }
  }
  return "";
});
</script>

<style scoped lang="scss">
.notification-item {
  display: flex;
  position: relative;
  column-gap: 8px;
  color: #404f6f;
  padding: var(--spacing-2, 8px) var(--spacing-3, 12px) var(--spacing-3, 8px)
    var(--spacing-3, 12px);
  border-collapse: collapse;
  border-bottom: 1px solid var(--color-light-gray-200, #f2f5fa);

  transition: 0.3s;
  cursor: pointer;
  &:hover {
    border-radius: var(--radius-2, 12px);
    border-bottom-color: transparent;
    background-color: #f2f5fa;
  }
  &:last-of-type {
    border-bottom: none;
  }

  &-icon {
    align-self: flex-start;
    flex-basis: 43px;
    width: 8px;
    flex-shrink: 0;
    height: 43px;
    border-radius: 50%;
    background-color: #f2f5fa;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &-content {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
  }

  &-body {
    font-size: 15px;
    line-height: 20px;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
  }
  &-message {
    display: flex;
    align-items: flex-start;
    column-gap: 4px;

    &__owner {
      color: #7a88a6;
    }
  }
  &-status {
    margin-top: 6px;
    width: 8px;
    flex-basis: 8px;
    flex-shrink: 0;
    height: 8px;
    border-radius: 50%;
    background-color: #13b8ba;
  }

  &-time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #7a88a6;
  }
  &-appeal-btn {
    display: inline-flex;
    border-radius: 12px;
    padding: 8px 16px;
    background-color: #e3e8f0;
    font-size: 15px;
    line-height: 20px;
    font-weight: 500;
  }
}
</style>
