import { boot } from "quasar/wrappers";
import { useAuthStore } from "src/stores/authStore";

const TOKEN_LIFETIME = 2 * 60 * 60;
export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      const token = localStorage.getItem("authToken");
      const currentTime = Math.floor(Date.now() / 1000);
      const lastUpdateTime = localStorage.getItem("lastTokenUpdate");
      if (token && currentTime - lastUpdateTime > TOKEN_LIFETIME) {
        return next("/login");
      } else if (token) {
        return next();
      } else {
        return next("/login");
      }
    } else {
      return next();
    }
  });
});
