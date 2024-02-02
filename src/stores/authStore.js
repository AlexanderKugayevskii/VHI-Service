import { defineStore } from "pinia";
import { ref } from "vue";
import LoginService from "src/services/LoginService";
import { useI18n } from "vue-i18n";
export const useAuthStore = defineStore("auth", () => {
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
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await LoginService.login(credentials);
      console.log(response);
      const data = response.data;
      console.log(data);
      setUser({ user: data.user, token: data.token });
    } catch (error) {
      setError("login_page.signin_error");
    } finally {
      setLoading(false);
    }
  };

  const initializeFromLocalStorage = () => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("authUser");
    if (token && user) {
      user = JSON.parse(user);
      token = token;
    }
  };
  return { login, logout, initializeFromLocalStorage, user, error, loading };
});
