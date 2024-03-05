import { boot } from "quasar/wrappers";
import { useAuthStore } from "src/stores/authStore";

export default boot(({ app }) => {
  const pinia = app.config.globalProperties.$pinia;
  const authStore = useAuthStore(pinia);

  // Initialize auth state from localStorage
  authStore.initializeFromLocalStorage();
});
