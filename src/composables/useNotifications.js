import { ref } from "vue";
import NotificationService from "src/services/NotificationService";

const useNotifications = () => {
  const notifications = ref([]);
  const isPolling = ref(false);

  const fetchNotifications = async () => {
    try {
      const response = await NotificationService.getNotifications();
      if (response.status !== 200) {
        throw new Error("Network response was not ok");
      }
      
      const data = response.data.data;
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
