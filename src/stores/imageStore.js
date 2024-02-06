// store/imageStore.js
import { defineStore } from "pinia";

export const useImageStore = defineStore("imageStore", {
  state: () => ({
    imageData: null,
  }),
  actions: {
    setImageData(data) {
      this.imageData = data;
    },
    clearImageData() {
      this.imageData = null;
    },
    async uploadImageToServer() {
      if (!this.imageData) return;

      try {
        // Здесь должен быть ваш код для отправки изображения на сервер
        // Используйте this.imageData как данные для отправки
      } catch (error) {
        console.error("Ошибка при загрузке изображения на сервер:", error);
      }
    },
  },
});
