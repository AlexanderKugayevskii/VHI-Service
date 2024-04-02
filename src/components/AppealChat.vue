<template>
  <div class="chat">
    <div class="chat-header">
      <SimpleInput placeholder="Написать сообщение...">
        <template #action-button>
          <button class="btn-reset pointer">
            <q-icon size="20px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3.4244 7.99984L2.28058 9.14366C1.01715 10.4071 1.01715 12.4555 2.28058 13.7189C3.54401 14.9824 5.59243 14.9824 6.85586 13.7189L13.7188 6.85602C14.9822 5.59259 14.9822 3.54417 13.7188 2.28074C12.4553 1.01731 10.4069 1.01731 9.14349 2.28074L6.5699 4.85433C5.78026 5.64398 5.78026 6.92424 6.5699 7.71388C7.35954 8.50352 8.63981 8.50352 9.42945 7.71388L10.8592 6.28411"
                  stroke="#A0AABC"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </q-icon>
          </button>
        </template>
      </SimpleInput>
      <button class="btn-reset pointer btn-send" @click="sendMessage">
        <q-icon size="20px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M6.75872 2.52487L13.892 6.09153C17.092 7.69153 17.092 10.3082 13.892 11.9082L6.75872 15.4749C1.95872 17.8749 0.000382516 15.9082 2.40038 11.1165L3.12538 9.67487C3.30872 9.3082 3.30872 8.69987 3.12538 8.3332L2.40038 6.8832C0.000382516 2.09153 1.96705 0.124868 6.75872 2.52487Z"
              stroke="#ECFFFF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.36719 9H7.86719"
              stroke="#ECFFFF"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </q-icon>
      </button>
      {{ appealId }}
    </div>
    <div class="chat-body">
      <!-- <div class="chat-item">
        <div class="chat-avatar">
          <img src="../assets/test-chat-avatar.png" />
        </div>
        <div class="chat-message">
          <div class="chat-message-header">
            <div class="chat-message-title">Ходжаев Сергей</div>
            <div class="chat-message-extra">
              <div class="chat-message-time">11:45</div>
              <div class="chat-message-viewed">
                <q-icon size="12px"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="10"
                    viewBox="0 0 13 10"
                    fill="none"
                  >
                    <path
                      d="M0.75 5L4.5 8.75L12 1.25"
                      stroke="#A0AABC"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </q-icon>
              </div>
            </div>
          </div>
          <div class="chat-message-body">И завтра на МРТ есть окно?</div>
        </div>
      </div>
      <div class="chat-item partner">
        <div class="chat-avatar">
          <img src="../assets/test-chat-avatar.png" />
        </div>
        <div class="chat-message">
          <div class="chat-message-header">
            <div class="chat-message-title">Ходжаев Сергей</div>
            <div class="chat-message-extra">
              <div class="chat-message-time">11:45</div>
              <div class="chat-message-viewed">
                <q-icon size="12px"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="10"
                    viewBox="0 0 13 10"
                    fill="none"
                  >
                    <path
                      d="M0.75 5L4.5 8.75L12 1.25"
                      stroke="#A0AABC"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </q-icon>
              </div>
            </div>
          </div>
          <div class="chat-message-body">И завтра на МРТ есть окно?</div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import SimpleInput from "./Shared/SimpleInput.vue";
import echo from "src/boot/chat";
import { ref, onMounted } from "vue";
import ChatService from "src/services/ChatService";

const message = ref("hello");
const messages = [];
const loading = ref(false);

const props = defineProps({
  appealId: {
    type: Number,
  },
});

const getMessages = async () => {
  try {
    const response = await ChatService.getMessages(props.appealId);
    console.log(response);
  } catch (e) {
    console.error(e);
  } finally {
  }
};

const sendMessage = async () => {
  const formData = new FormData();

  const payload = {
    message: message.value,
    application_id: props.appealId,
  };

  console.log(payload);
  formData.append("text", payload.message);
  formData.append("application_id", payload.application_id);

  try {
    const response = await ChatService.postMessage(formData);

    console.log(response);
  } catch (e) {
    console.error(e);
  } finally {
  }
};

onMounted(() => {
  getMessages();
  echo
    .channel(`dms_chat-${props.appealId}`)
    .listen("NotificationEvent", (e) => {
      console.log(e);
    });
});
</script>

<style scoped lang="scss">
.chat-header {
  display: flex;
  align-items: center;
  column-gap: 8px;
}
.btn-reset {
  background: none;
  border: none;
  outline: none;
}
.pointer {
  cursor: pointer;
}
.btn-send {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #13b8ba;
  padding: 12px;
}
.chat-body {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
}
.chat {
  &-header {
    margin-bottom: 20px;
  }

  &-item {
    display: flex;
    justify-content: flex-start;
    column-gap: 8px;

    .chat-avatar {
      flex-basis: 32px;
      img {
        border-radius: 50%;
        width: 32px;
        height: 32px;
        object-fit: cover;
        object-position: center;
      }
    }

    .chat-message {
      &-header {
        display: flex;
        align-items: center;
        column-gap: 8px;
        margin-bottom: 8px;
      }
      &-extra {
        display: flex;
        column-gap: 4px;
        align-items: center;
      }

      &-title {
        font-size: 17px;
        font-weight: 600;
        color: #404f6f;
      }
      &-time {
        font-size: 13px;
        color: #7a88a6;
      }
      &-viewed {
        display: flex;
        align-items: center;
      }
      &-body {
        padding: 10px 12px;
        display: flex;
        font-size: 15px;
        line-height: 20px;
        background-color: #ecffff;
        border-radius: 0 12px 12px 12px;
      }
    }

    &.partner {
      justify-content: flex-end;
      .chat-avatar {
        order: 1;
      }
      .chat-message {
        &-header {
          justify-content: flex-end;
        }
        &-extra {
          order: -1;
        }
        &-viewed {
          display: none;
        }
        &-body {
          background-color: #f2f5fa;
          border-radius: 12px 0 12px 12px;
        }
      }
    }
  }
}
</style>
