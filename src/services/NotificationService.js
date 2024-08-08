import { api } from "src/boot/axios";

function getNotifications() {
  return api.get("/clinics/notification");
}

export default {
  getNotifications,
};
