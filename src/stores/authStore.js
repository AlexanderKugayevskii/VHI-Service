import { defineStore } from "pinia";
import { ref } from "vue";
import LoginService from "src/services/LoginService";
import { useI18n } from "vue-i18n";
import { Notify } from "quasar";
import { useCommonStore } from "./commonStore";
import { useAppealsHistory } from "src/composables/useAppealsHistory";

export const useAuthStore = defineStore("auth", () => {
  const appealHistory = useAppealsHistory();
  //stores
  const commonStore = useCommonStore();
  //state
  const user = ref(null);
  const token = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const roles = ref([1, 6, 8, 9, 13]);

  //   const { t } = useI18n();
  //actions

  const setUser = (payload) => {
    user.value = payload.user;
    token.value = payload.token;
    localStorage.setItem("authToken", payload.token);
    localStorage.setItem("authUser", JSON.stringify(payload.user));

    commonStore.setUserInteracted();
  };

  const setLoading = (loadingValue) => {
    loading.value = loadingValue;
  };

  const setError = (err) => {
    error.value = err;
  };

  const clearUser = () => {
    user.value = null;
    token.value = null;

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    appealHistory.clearData();
  };
  const logout = () => {
    clearUser();

    Notify.create({
      type: "success",
      message: "Вы вышли из системы!",
      position: "bottom",
      timeout: 2000,
    });
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LoginService.login(credentials);
      const data = response.data;

      const roleId = data.user.role.id;

      if (!roles.value.includes(roleId)) {
        
        throw new Error();
      }
      setUser({ user: data.user, token: data.token });
      setLoading(false);
      Notify.create({
        type: "success",
        message: "Вы успешно вошли!",
        position: "bottom",
      });

      return true;
    } catch (error) {
      Notify.create({
        type: "error",
        message: "Не правильный логин или пароль!",
        position: "bottom",
        timeout: 250,
      });
      setError(error.response?.data?.error[0]);
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const initializeFromLocalStorage = () => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
    }
  };
  return {
    login,
    logout,
    initializeFromLocalStorage,
    user,
    error,
    loading,
    token,
  };
});
