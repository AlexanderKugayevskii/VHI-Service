import { api } from "src/boot/axios";

function login(credentials) {
  return api.post("/login", credentials);
}

export default {
  login,
};
