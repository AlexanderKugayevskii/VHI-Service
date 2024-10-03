import { ref } from "vue";
import NotificationService from "src/services/NotificationService";

const useNotifications = () => {
  const notifications = ref([]);
  const previousNotificationCount = ref(0); // Сохраняем предыдущее количество уведомлений
  const isPolling = ref(false);
  const notificationSound = new Audio("/notification-sound.mp3"); // Добавляем звук
  notificationSound.volume = 0.3; // Устанавливаем громкость на 50%

  let userInteracted = false;

  const handleUserInteraction = () => {
    userInteracted = true;

    console.log(userInteracted);
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

      if (data.length > previousNotificationCount.value) {
        notificationSound.play(); // Проигрываем звук, если пришло новое уведомление
        previousNotificationCount.value = data.length;
      }

      if (userInteracted) {
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
