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
            d="M9.77965 1.82273C11.2369 1.72586 12.7601 1.72566 14.2204 1.82273C18.787 2.12629 22.4103 5.81258 22.7082 10.4224C22.7639 11.2848 22.7639 12.1768 22.7082 13.0392C22.4103 17.649 18.787 21.3353 14.2204 21.6389C12.7601 21.7359 11.2369 21.7357 9.77965 21.6389C9.21472 21.6013 8.59978 21.4677 8.05839 21.2448C7.8203 21.1467 7.65868 21.0804 7.54041 21.037C7.45909 21.0929 7.35108 21.1723 7.1938 21.2883C6.40136 21.8726 5.40092 22.2825 3.98117 22.248L3.93544 22.2469C3.66155 22.2403 3.36961 22.2334 3.13152 22.1873C2.84475 22.1318 2.48996 21.9931 2.26791 21.6145C2.02623 21.2025 2.12313 20.7858 2.21688 20.5234C2.30536 20.2757 2.45874 19.9852 2.61542 19.6885L2.6369 19.6478C3.10323 18.7641 3.23314 18.0419 2.98381 17.5604C2.15148 16.304 1.40272 14.7556 1.2918 13.0392C1.23607 12.1768 1.23607 11.2848 1.2918 10.4224C1.58972 5.81258 5.213 2.12629 9.77965 1.82273ZM8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H8.00897C8.56126 13 9.00897 12.5523 9.00897 12C9.00897 11.4477 8.56126 11 8.00897 11H8ZM11.9955 11C11.4432 11 10.9955 11.4477 10.9955 12C10.9955 12.5523 11.4432 13 11.9955 13H12.0045C12.5568 13 13.0045 12.5523 13.0045 12C13.0045 11.4477 12.5568 11 12.0045 11H11.9955ZM15.991 11C15.4387 11 14.991 11.4477 14.991 12C14.991 12.5523 15.4387 13 15.991 13H16C16.5523 13 17 12.5523 17 12C17 11.4477 16.5523 11 16 11H15.991Z"
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
  console.log(props.notification);
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
