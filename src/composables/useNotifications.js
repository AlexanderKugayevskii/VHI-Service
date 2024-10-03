import { computed, ref } from "vue";
import NotificationService from "src/services/NotificationService";
import { useAuthStore } from "src/stores/authStore";
import { useCommonStore } from "src/stores/commonStore";

const useNotifications = () => {
  const authStore = useAuthStore();
  const commonStore = useCommonStore();
  const notifications = ref([]);
  const previousNotificationCount = ref(0); // Сохраняем предыдущее количество уведомлений
  const isPolling = ref(false);

  //sound
  const notificationSound = new Audio("/notification-sound.mp3"); // Добавляем звук
  notificationSound.volume = 0.3; // Устанавливаем громкость на 50%

  const handleUserInteraction = () => {
    commonStore.setUserInteracted();
    document.removeEventListener("click", handleUserInteraction);
  };

  document.addEventListener("click", handleUserInteraction); // Ждем первого клика пользователя

  const fetchNotifications = async () => {
    try {
      const response = await NotificationService.getNotifications();
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }

      const data = response.data.data;

      if (
        data.length > previousNotificationCount.value &&
        commonStore.userInteracted
      ) {
        notificationSound.play(); // Проигрываем звук, если пришло новое уведомление
        previousNotificationCount.value = data.length;
      }

      notifications.value = data;
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  const startPolling = () => {
    if (isPolling.value) return;

    isPolling.value = true;

    const poll = async () => {
      await fetchNotifications();
      if (isPolling.value) {
        setTimeout(poll, 3000);
      }
    };

    poll();
  };

  const stopPolling = () => {
    isPolling.value = false;
  };

  return { notifications, startPolling, stopPolling };
};

export default useNotifications;
