import { api } from "../boot/axios";

function getMessages(appealId) {
  return api.get(`/clinics/messages/${appealId}`);
}

function postMessage(payload) {
  return api.post("/clinics/messages", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export default {
  getMessages,
  postMessage,
};
