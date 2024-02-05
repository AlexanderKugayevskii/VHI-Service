import { boot } from "quasar/wrappers";
import { useAuthStore } from "src/stores/authStore";

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    console.log(authStore.user);
    // Проверяем, требует ли маршрут аутентификаци
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      // Здесь проверяем, аутентифицирован ли пользователь

      if (!authStore.user) {
        // Если пользователь не аутентифицирован, перенаправляем на страницу входа
        next({ name: "login" });
      } else {
        // Если аутентифицирован, продолжаем навигацию
        next();
      }
    } else {
      // Для маршрутов без требования аутентификации просто продолжаем навигацию
      next();
    }
  });
});
