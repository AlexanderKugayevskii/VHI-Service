import { defineStore } from "pinia";
import { ref } from "vue";
import LoginService from "src/services/LoginService";
import { useI18n } from "vue-i18n";
import { useAppealStore } from "./appealStore";

export const useAuthStore = defineStore("auth", () => {
  const appealStore = useAppealStore();
  //state
  const user = ref(null);
  const token = ref(null);
  const loading = ref(false);
  const error = ref(null);

  //   const { t } = useI18n();
  //actions
  const setUser = (payload) => {
    user.value = payload.user;
    token.value = payload.token;

    localStorage.setItem("authToken", payload.token);
    localStorage.setItem("authUser", JSON.stringify(payload.user));
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
  };
  const logout = () => {
    clearUser();
    appealStore.clearClinicData();
    appealStore.clearAppealData();
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LoginService.login(credentials);
      const data = response.data;
      setUser({ user: data.user, token: data.token });
      setLoading(false);
      return true;
    } catch (error) {
      setError("login_page.signin_error");
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
