<template>
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
        <q-item clickable v-close-popup class="item--no-hover">
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
          <span class="option-text">Редактировать</span>
        </q-item>

        <q-item
          clickable
          v-close-popup
          class="item--no-hover"
          @click="openAppealPage"
        >
          <q-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="12"
              viewBox="0 0 18 12"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M16.6083 7.78919C17.0732 7.30958 17.3331 6.66791 17.3331 6.00002C17.3331 5.33213 17.0732 4.69046 16.6083 4.21085C14.9783 2.49585 12.18 0.166687 9 0.166687C5.82 0.166687 3.02084 2.49585 1.39167 4.21085C0.926854 4.69046 0.666931 5.33213 0.666931 6.00002C0.666931 6.66791 0.926854 7.30958 1.39167 7.78919C3.02084 9.50419 5.82 11.8334 9 11.8334C12.18 11.8334 14.9783 9.50419 16.6083 7.78919ZM9 8.50002C9.66304 8.50002 10.2989 8.23663 10.7678 7.76779C11.2366 7.29895 11.5 6.66306 11.5 6.00002C11.5 5.33698 11.2366 4.70109 10.7678 4.23225C10.2989 3.76341 9.66304 3.50002 9 3.50002C8.33696 3.50002 7.70108 3.76341 7.23224 4.23225C6.76339 4.70109 6.5 5.33698 6.5 6.00002C6.5 6.66306 6.76339 7.29895 7.23224 7.76779C7.70108 8.23663 8.33696 8.50002 9 8.50002Z"
                fill="#E3E8F0"
              />
            </svg>
          </q-icon>
          <span class="option-text">Просмотр</span>
        </q-item></template
      >
    </DropdownSettings>
  </div>
</template>

<script setup>
import { watch } from "vue";
import DropdownSettings from "../Shared/DropdownSettings.vue";
import { useRouter } from "vue-router";
import { useAppealStore } from "src/stores/appealStore";
import Trans from "src/i18n/translation";
const props = defineProps(["client"]);

const router = useRouter();
const appealStore = useAppealStore();

const openAppealPage = async () => {
  appealStore.setClient(props.client);
  await appealStore.fetchApplicantData();
  await appealStore.fetchHospitalData();
};

watch(
  () => appealStore.loading,
  () => {
    if (!appealStore.loading) {
      appealStore.setTypeOfAppeal("CHANGE");
      router.replace(
        Trans.i18nRoute({
          name: "createAppeal",
          params: { id: appealStore.client.contractClientId },
        })
      );
    }
  }
);
</script>

<style lang="scss" scoped>
.user-settings-btn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}
.q-item {
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
</style>
