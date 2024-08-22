import { boot } from "quasar/wrappers";
import axios from "axios";
import EIMZO from "./eimzo/EIMZO";

const didox = axios.create({ baseURL: "https://api.didox.uz/" });

didox.interceptors.request.use((config) => {
  const token = localStorage.getItem("token_didox");
  const authorization = token ? "Bearer " + token : "";
  config.headers.Authorization = authorization;
  config.headers["api-key"] = token;
  config.headers["user-key"] = token;
  config.headers["Content-Type"] = "application/json";

  return config;
});

export default boot(({ app }) => {
  app.config.globalProperties.$didox = didox;
  const VueEIMZO = new EIMZO();
  // console.log(VueEIMZO);
  app.use(VueEIMZO);
  app.config.globalProperties.$eimzo = VueEIMZO;
});

export { didox };
