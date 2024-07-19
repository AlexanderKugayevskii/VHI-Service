<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="body-bg bordered">
      <q-toolbar class="q-px-lg q-py-sm">
        <q-space></q-space>
        <div class="right-side">
          <LanguageSwitcher />
          <!-- <div class="balance q-py-xxs q-px-sm">
            <span class="balance-desc">Баланс: </span>
            <span class="balance-amount">190 000 UZS</span>
          </div> -->

          <!-- notification -->
          <AppealNotification />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      :width="250"
      show-if-above
      class="nav-bg q-pt-md q-pb-sm flex column"
    >
      <div class="flex flex-center q-pb-xxl">
        <img alt="Logo Neo Insurance" src="~assets/logo-neo.svg" />
      </div>
      <div class="flex column justify-between nav-grow">
        <q-list>
          <div class="q-px-sm menu-expand-item" v-if="appealStore.isAgent">
            <div class="menu-expand-item-header">
              <button class="nav-item nav-item-btn q-py-sm" @click="toggleMenu">
                <span class="nav-item-btn-left">
                  <q-icon size="20px">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M6.29163 3.16675C6.29163 2.66947 6.48917 2.19255 6.8408 1.84092C7.19243 1.48929 7.66934 1.29175 8.16663 1.29175H9.83329C10.3306 1.29175 10.8075 1.48929 11.1591 1.84092C11.5107 2.19255 11.7083 2.66947 11.7083 3.16675V4.00008H6.29163V3.16675ZM5.04163 4.00008V3.16675C5.04163 2.33795 5.37087 1.54309 5.95692 0.957039C6.54297 0.370988 7.33782 0.041748 8.16663 0.041748H9.83329C10.6621 0.041748 11.457 0.370988 12.043 0.957039C12.6291 1.54309 12.9583 2.33795 12.9583 3.16675V4.00008H14C14.884 4.00008 15.7319 4.35127 16.357 4.97639C16.9821 5.60151 17.3333 6.44936 17.3333 7.33341V14.0001C17.3333 14.8841 16.9821 15.732 16.357 16.3571C15.7319 16.9822 14.884 17.3334 14 17.3334H3.99996C3.1159 17.3334 2.26806 16.9822 1.64294 16.3571C1.01782 15.732 0.666626 14.8841 0.666626 14.0001V7.33341C0.666626 6.44936 1.01782 5.60151 1.64294 4.97639C2.26806 4.35127 3.1159 4.00008 3.99996 4.00008H5.04163ZM8.99996 7.54175C9.16572 7.54175 9.32469 7.6076 9.4419 7.72481C9.55911 7.84202 9.62496 8.00099 9.62496 8.16675V10.0417H11.5C11.6657 10.0417 11.8247 10.1076 11.9419 10.2248C12.0591 10.342 12.125 10.501 12.125 10.6667C12.125 10.8325 12.0591 10.9915 11.9419 11.1087C11.8247 11.2259 11.6657 11.2917 11.5 11.2917H9.62496V13.1667C9.62496 13.3325 9.55911 13.4915 9.4419 13.6087C9.32469 13.7259 9.16572 13.7917 8.99996 13.7917C8.8342 13.7917 8.67523 13.7259 8.55802 13.6087C8.44081 13.4915 8.37496 13.3325 8.37496 13.1667V11.2917H6.49996C6.3342 11.2917 6.17523 11.2259 6.05802 11.1087C5.94081 10.9915 5.87496 10.8325 5.87496 10.6667C5.87496 10.501 5.94081 10.342 6.05802 10.2248C6.17523 10.1076 6.3342 10.0417 6.49996 10.0417H8.37496V8.16675C8.37496 8.00099 8.44081 7.84202 8.55802 7.72481C8.67523 7.6076 8.8342 7.54175 8.99996 7.54175Z"
                        fill="#7A88A6"
                      />
                    </svg>
                  </q-icon>
                  <span class="flex column">
                    <span>
                      {{ $t("nav.appeals") }}
                    </span>
                    <span class="menu-expand-subtitle"> Клиники, аптеки </span>
                  </span>
                </span>
                <q-icon size="20px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#7A88A6"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </q-icon>
              </button>
            </div>
            <Collapse :when="isMenuOpen" class="v-collapse">
              <div class="menu-expand-item-content" ref="menuExpandContent">
                <RouteLink
                  caption="Клиники"
                  :routeTo="Trans.i18nRoute({ name: 'appeals-page' })"
                >
                </RouteLink>
                <RouteLink
                  caption="Аптеки"
                  :routeTo="Trans.i18nRoute({ name: 'drugstore-page' })"
                ></RouteLink>
              </div>
            </Collapse>
          </div>
          <RouteLink
            class="q-px-sm"
            :caption="$t('nav.clients')"
            v-if="appealStore.isAgent"
            :routeTo="Trans.i18nRoute({ name: 'clients' })"
          >
          </RouteLink>

          <div class="q-px-sm menu-expand-item" v-if="appealStore.isAgent">
            <div class="menu-expand-item-header">
              <button class="nav-item nav-item-btn q-py-sm" @click="toggleMenu">
                <span class="nav-item-btn-left">
                  <q-icon size="20px"> </q-icon>
                  <span class="flex column">
                    <span> Отчеты </span>
                  </span>
                </span>
                <q-icon size="20px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#7A88A6"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </q-icon>
              </button>
            </div>
            <Collapse :when="isMenuOpen" class="v-collapse">
              <div class="menu-expand-item-content" ref="menuExpandContent">
                <RouteLink
                  caption="По клиникам"
                  v-if="appealStore.isAgent"
                  :routeTo="Trans.i18nRoute({ name: 'reports-clinic-page' })"
                >
                </RouteLink>
                <RouteLink
                  caption="По аптекам"
                  v-if="appealStore.isAgent"
                  :routeTo="Trans.i18nRoute({ name: 'reports-drugstore-page' })"
                >
                </RouteLink>
                <RouteLink
                  caption="По организациям"
                  v-if="appealStore.isAgent"
                  :routeTo="
                    Trans.i18nRoute({ name: 'reports-organizations-page' })
                  "
                >
                </RouteLink>
              </div>
            </Collapse>
          </div>
          <RouteLink
            v-if="appealStore.isClinic"
            class="q-px-sm"
            caption="Обращения"
            :routeTo="Trans.i18nRoute({ name: 'appeals-page' })"
          >
            <template v-slot:icon>
              <q-icon size="20px">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.29163 3.16675C6.29163 2.66947 6.48917 2.19255 6.8408 1.84092C7.19243 1.48929 7.66934 1.29175 8.16663 1.29175H9.83329C10.3306 1.29175 10.8075 1.48929 11.1591 1.84092C11.5107 2.19255 11.7083 2.66947 11.7083 3.16675V4.00008H6.29163V3.16675ZM5.04163 4.00008V3.16675C5.04163 2.33795 5.37087 1.54309 5.95692 0.957039C6.54297 0.370988 7.33782 0.041748 8.16663 0.041748H9.83329C10.6621 0.041748 11.457 0.370988 12.043 0.957039C12.6291 1.54309 12.9583 2.33795 12.9583 3.16675V4.00008H14C14.884 4.00008 15.7319 4.35127 16.357 4.97639C16.9821 5.60151 17.3333 6.44936 17.3333 7.33341V14.0001C17.3333 14.8841 16.9821 15.732 16.357 16.3571C15.7319 16.9822 14.884 17.3334 14 17.3334H3.99996C3.1159 17.3334 2.26806 16.9822 1.64294 16.3571C1.01782 15.732 0.666626 14.8841 0.666626 14.0001V7.33341C0.666626 6.44936 1.01782 5.60151 1.64294 4.97639C2.26806 4.35127 3.1159 4.00008 3.99996 4.00008H5.04163ZM8.99996 7.54175C9.16572 7.54175 9.32469 7.6076 9.4419 7.72481C9.55911 7.84202 9.62496 8.00099 9.62496 8.16675V10.0417H11.5C11.6657 10.0417 11.8247 10.1076 11.9419 10.2248C12.0591 10.342 12.125 10.501 12.125 10.6667C12.125 10.8325 12.0591 10.9915 11.9419 11.1087C11.8247 11.2259 11.6657 11.2917 11.5 11.2917H9.62496V13.1667C9.62496 13.3325 9.55911 13.4915 9.4419 13.6087C9.32469 13.7259 9.16572 13.7917 8.99996 13.7917C8.8342 13.7917 8.67523 13.7259 8.55802 13.6087C8.44081 13.4915 8.37496 13.3325 8.37496 13.1667V11.2917H6.49996C6.3342 11.2917 6.17523 11.2259 6.05802 11.1087C5.94081 10.9915 5.87496 10.8325 5.87496 10.6667C5.87496 10.501 5.94081 10.342 6.05802 10.2248C6.17523 10.1076 6.3342 10.0417 6.49996 10.0417H8.37496V8.16675C8.37496 8.00099 8.44081 7.84202 8.55802 7.72481C8.67523 7.6076 8.8342 7.54175 8.99996 7.54175Z"
                    fill="#7A88A6"
                  />
                </svg>
              </q-icon>
            </template>
          </RouteLink>
        </q-list>
        <div class="q-px-sm">
          <q-item class="q-pa-xs user justify-between">
            <q-item-section avatar class="q-pr-xs">
              <q-avatar size="47px">
                <img
                  :src="`https://api.neoinsurance.uz/${authStore.user?.avatar}`"
                />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="user-name">
                {{ authStore.user?.lastname }}
                {{ authStore.user?.name[0] }}.</q-item-label
              >
              <q-item-label class="user-id" lines="1"
                >Agent ID: {{ authStore.user?.agent_id }}</q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <div class="user-settings">
                <DropdownSettings>
                  <template v-slot:icon>
                    <q-icon size="20px">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M10 10.8333C10.221 10.8333 10.433 10.7455 10.5893 10.5892C10.7456 10.433 10.8334 10.221 10.8334 9.99998C10.8334 9.77897 10.7456 9.567 10.5893 9.41072C10.433 9.25444 10.221 9.16665 10 9.16665C9.77901 9.16665 9.56704 9.25444 9.41076 9.41072C9.25448 9.56701 9.16669 9.77897 9.16669 9.99998C9.16669 10.221 9.25448 10.433 9.41076 10.5892C9.56704 10.7455 9.77901 10.8333 10 10.8333Z"
                          fill="#404F6F"
                          stroke="#404F6F"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M15.8333 10.8333C16.0543 10.8333 16.2663 10.7455 16.4226 10.5892C16.5789 10.433 16.6667 10.221 16.6667 9.99998C16.6667 9.77897 16.5789 9.567 16.4226 9.41072C16.2663 9.25444 16.0543 9.16665 15.8333 9.16665C15.6123 9.16665 15.4004 9.25444 15.2441 9.41072C15.0878 9.56701 15 9.77897 15 9.99998C15 10.221 15.0878 10.433 15.2441 10.5892C15.4004 10.7455 15.6123 10.8333 15.8333 10.8333Z"
                          stroke="#404F6F"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.16665 10.8333C4.38766 10.8333 4.59962 10.7455 4.7559 10.5892C4.91218 10.433 4.99998 10.221 4.99998 9.99998C4.99998 9.77897 4.91218 9.567 4.7559 9.41072C4.59962 9.25444 4.38766 9.16665 4.16665 9.16665C3.94563 9.16665 3.73367 9.25444 3.57739 9.41072C3.42111 9.56701 3.33331 9.77897 3.33331 9.99998C3.33331 10.221 3.42111 10.433 3.57739 10.5892C3.73367 10.7455 3.94563 10.8333 4.16665 10.8333Z"
                          stroke="#404F6F"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </q-icon>
                  </template>
                  <template v-slot:options>
                    <q-item
                      clickable
                      v-close-popup
                      class="item--no-hover settings-item"
                      @click="handleLogout"
                    >
                      <q-icon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.8492 1.06414C11.0281 0.885194 11.2405 0.743241 11.4743 0.646392C11.708 0.549543 11.9586 0.499695 12.2117 0.499695C12.4647 0.499695 12.7153 0.549543 12.9491 0.646392C13.1828 0.743241 13.3953 0.885194 13.5742 1.06414L14.9358 2.42664C15.297 2.78794 15.4999 3.27788 15.4999 3.78873C15.4999 4.29958 15.297 4.78951 14.9358 5.15081L13.7275 6.35914C13.6277 6.30954 13.5285 6.2587 13.43 6.20664C12.7342 5.83998 11.9075 5.32581 11.2908 4.70914C10.6742 4.09248 10.16 3.26581 9.79333 2.56998C9.74155 2.47116 9.69099 2.37171 9.64167 2.27164L10.8492 1.06414ZM10.4075 5.59248C11.1367 6.32248 12.065 6.89664 12.7992 7.28664L8.05 12.0366C7.7552 12.3315 7.37273 12.5227 6.96 12.5816L4.1 12.99C3.95193 13.0112 3.80097 12.9976 3.65906 12.9503C3.51716 12.903 3.38822 12.8233 3.28245 12.7175C3.17669 12.6118 3.097 12.4828 3.04971 12.3409C3.00242 12.199 2.98883 12.048 3.01 11.9L3.41833 9.03998C3.4775 8.62748 3.66833 8.24498 3.96333 7.94998L8.71333 3.19998C9.10333 3.93498 9.6775 4.86331 10.4075 5.59248ZM1.125 14.25C0.95924 14.25 0.800268 14.3158 0.683058 14.433C0.565848 14.5502 0.5 14.7092 0.5 14.875C0.5 15.0407 0.565848 15.1997 0.683058 15.3169C0.800268 15.4341 0.95924 15.5 1.125 15.5H14.875C15.0408 15.5 15.1997 15.4341 15.3169 15.3169C15.4342 15.1997 15.5 15.0407 15.5 14.875C15.5 14.7092 15.4342 14.5502 15.3169 14.433C15.1997 14.3158 15.0408 14.25 14.875 14.25H1.125Z"
                            fill="#E3E8F0"
                          />
                        </svg>
                      </q-icon>
                      <span class="option-text">Выйти</span>
                    </q-item>
                  </template>
                </DropdownSettings>
              </div>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import LanguageSwitcher from "src/components/LanguageSwitcher.vue";
import { defineComponent, onMounted } from "vue";
import RouteLink from "components/RouteLink/RouteLink.vue";
import AppealNotification from "components/AppealNotification.vue";
import Trans from "src/i18n/translation";
import { useAuthStore } from "src/stores/authStore";
import { useAppealStore } from "src/stores/appealStore";
import { useRouter } from "vue-router";
import DropdownSettings from "src/components/Shared/DropdownSettings.vue";
import { Collapse } from "vue-collapsed";
import { onBeforeMount } from "vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    Collapse,
    RouteLink,
    LanguageSwitcher,
    DropdownSettings,
    AppealNotification,
  },

  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const appealStore = useAppealStore();
    const isMenuOpen = ref(false);

    const handleLogout = () => {
      authStore.logout();
      router.replace({ name: "Login" });
      appealStore.clearAppealData();
      appealStore.clearClinicData();
    };

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    onBeforeMount(() => {
      if (
        router.hasRoute("appeals-page") ||
        router.hasRoute("drugstore-page")
      ) {
        isMenuOpen.value = true;
      }
    });
    return {
      Trans,
      authStore,
      appealStore,
      handleLogout,
      isMenuOpen,
      toggleMenu,
    };
  },
});
</script>

<style lang="scss" scoped>
.q-item {
  min-height: 44px;
  margin-bottom: 0;
}
.search-input {
  background-color: $lightgray;
  border-radius: 50px;
  width: 300px;
  font-size: 15px;
  color: #7a88a6;
}
.q-field__native {
  padding: 0;
}
.search-input::placeholder {
  font-size: 15px;
  color: #7a88a6;
}
.nav-bg {
  background-color: $nav-bg;
}
.nav-grow {
  flex-grow: 1;
}
.bordered {
  border-bottom: 1px solid #e3e8f0;
}

.right-side {
  display: flex;
  column-gap: 20px;
  align-items: center;
}

.balance {
  border-radius: 50px;
  background-color: #fff;
  color: $primary;
  display: flex;
  align-items: baseline;
  user-select: none;

  &-amount {
    margin-left: 8px;
    font-size: 17px;
    font-weight: 600;
  }
}

.user {
  color: $primary;
  background-color: #edf0f5;
  border-radius: 12px;
  &-name {
    font-size: 15px;
    font-weight: 500;
    line-height: 20px !important;
  }
  &-id {
    font-size: 13px;
    line-height: 17px !important;
    margin-top: 2px;
  }
}

.user-settings-btn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}

.settings-item.q-item {
  background-color: transparent;
  min-height: 0;
  padding: 8px;
  column-gap: 8px;
  align-items: center;
  border-radius: 8px;
  &:hover {
    background-color: #596787;
  }
}

.option-text {
  font-size: 15px;
  line-height: 20px;
  color: #f2f5fa;
}
.nav-item-btn {
  border: none;
  outline: none;
  background: none;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 8px;
  padding: var(--spacing-3, 12px) var(--spacing-2, 8px) var(--spacing-3, 12px)
    var(--spacing-3, 12px);
  color: $primary;
  font-size: 15px;
  line-height: 20px;
  width: 100%;
  transition: 0.3s;

  &-left {
    display: flex;
    align-items: center;
    column-gap: 8px;
  }
  &:hover {
    background-color: $hover;
  }
}
.menu-expand-item {
  margin-bottom: 4px;
}
.menu-expand-item-header {
  margin-bottom: 4px;
}
.menu-expand-subtitle {
  font-size: 12px;
  color: #7a88a6;
  font-weight: 400;
}
.menu-expand-item-content {
  padding-left: 33px;
  position: relative;
  overflow: hidden;
  transition: 0.3s linear;
  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 21px;
    top: 0;
    height: 100%;
    width: 1px;
    background-color: #e3e8f0;
  }
}
.menu-expand-item:has(.router-link-active) .nav-item-btn {
  background-color: $hover;
}
.v-collapse {
  transition: height 300ms cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
