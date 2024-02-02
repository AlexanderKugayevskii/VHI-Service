<template>
  <div class="body">
    <img alt="Logo Neo Insurance" src="~assets/logo-neo.svg" class="left_img" />
    <div class="login-box">
      <span class="title_text">{{
        $t("login_page.title", { company: "NEO DMS" })
      }}</span>
      <form class="form" @submit.prevent="handleLogin">
        <div class="inputs-wrapper">
          <div class="user-box">
            <SimpleInput
              :label="$t('login_page.login_label')"
              :placeholder="$t('login_page.login_placeholder')"
              v-model="credentials.user"
            ></SimpleInput>
          </div>
          <div class="user-box">
            <SimpleInput
              :label="$t('login_page.password_label')"
              :placeholder="$t('login_page.password_placeholder')"
              v-model="credentials.password"
              type="password"
            ></SimpleInput>
          </div>
        </div>
        <SimpleButton
          type="submit"
          :label="$t('login_page.signin_label')"
          custom-class="btn-action full-width"
        ></SimpleButton>
        <!-- <button type="submit" class="login-btn">Kirish</button> -->
      </form>
      <div v-if="loading">Logging in...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="flex flex-center">
        <LanguageSwitcher></LanguageSwitcher>
      </div>
    </div>
  </div>
</template>

<script setup>
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import LanguageSwitcher from "src/components/LanguageSwitcher.vue";

import { ref, computed } from "vue";
import { useAuthStore } from "src/stores/authStore";

const authStore = useAuthStore();
const credentials = ref({ user: "", password: "" });
const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

const handleLogin = () => {
  authStore.login(credentials.value);
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap");
html {
  height: 100%;
}
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  transition: background-color 50000s ease-in-out 0s,
    color 50000s ease-in-out 0s;
}
.body {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: "Inter", sans-serif;
  background: #e3e8f0;
}

.login-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 407px;
  padding: 32px;
  transform: translate(-50%, -50%);
  background: #fff;
  box-sizing: border-box;
  border-radius: 24px;
  display: grid;
  gap: 24px;
}

.login-box .title_text {
  font-size: 31px;
  margin-bottom: 16px;
  color: #2c3955;
  text-align: center;
  font-weight: 700;
}

.left_img {
  box-sizing: content-box;
  width: 141px;
  padding: 48px;
}
.form {
  display: flex;
  flex-direction: column;
  row-gap: 24px;
}
.inputs-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}
</style>
