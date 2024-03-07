import { boot, route } from "quasar/wrappers";
import { useAuthStore } from "src/stores/authStore";

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
        return next();
      } else {
        return next('/login');
      }
    } else {
      return next();
    }
  });
});
