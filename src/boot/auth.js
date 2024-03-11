import { boot } from "quasar/wrappers";
import { useAuthStore } from "src/stores/authStore";
import axios from "axios";

const TOKEN_LIFETIME = 2 * 60 * 60;
export default boot(({ app, router }) => {
  const pinia = app.config.globalProperties.$pinia;
  const authStore = useAuthStore(pinia);

  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    const lastTokenUpdateTime = localStorage.getItem("lastTokenUpdate");
    const currentTime = Math.floor(Date.now() / 1000);

    if (
      lastTokenUpdateTime &&
      currentTime - lastTokenUpdateTime > TOKEN_LIFETIME
    ) {
      // Токен протух, перенаправляем на страницу логина
      router.replace({ name: "Login" });
    } else {
      // Устанавливаем токен для всех последующих запросов
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
      authStore.initializeFromLocalStorage();
    }
  }
});
