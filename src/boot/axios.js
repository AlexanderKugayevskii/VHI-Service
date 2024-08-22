import { boot } from "quasar/wrappers";
import axios from "axios";
import echo from "./chat";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
// const api = axios.create({ baseURL: 'http://localhost:3000' })
// const fakeUrl = "http://localhost:3000";
// const api = axios.create({ baseURL: fakeUrl });

const TOKEN_LIFETIME = 2 * 60 * 60; // В секундах (2 часа)

const url = "https://api.neoinsurance.uz";
// const url = "http://127.0.0.1:8000";
const api = axios.create({ baseURL: url + "/api" });

export default boot(({ app, router }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api
  function redirectToLogin() {
    // console.log("Токен протух. Перенаправляем на страницу логина.");
  }
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const lastTokenUpdateTime = localStorage.getItem("lastTokenUpdate");
      const currentTime = Math.floor(Date.now() / 1000);

      if (
        lastTokenUpdateTime &&
        currentTime - lastTokenUpdateTime > TOKEN_LIFETIME
      ) {
        console.log("Токен протух. Перенаправляем на страницу логина.");
        router.replace({ name: "Login" });
      } else {
        config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["X-Socket-ID"] = echo.socketId();
      }
    }
    config.headers["Access-Control-Allow-Origin"] = "*";
    // console.log("any request");
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      localStorage.setItem("lastTokenUpdate", Math.floor(Date.now() / 1000));
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        router.replace({ name: "Login" });
      }

      return Promise.reject(error);
    }
  );

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api, axios };
