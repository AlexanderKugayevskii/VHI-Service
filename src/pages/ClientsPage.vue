<template>
  <q-page class="flex flex-center column body-bg">
    <h1>Клиенты</h1>
    <div class="full-width q-mb-md">
      <SimpleInput v-model="inputValue"></SimpleInput>
    </div>
    <div class="full-width">
      <DropdownSelect
        :fetch-function="ClientService.getClientsBySearch"
        label="Статус"
        id-key="clientID"
      >
        <template #option-content="{ option }">
          <div class="option-content">
            <div class="image-wrapper">
              <img src="/src/assets/temp/propfmedservice.png" />
            </div>
            <span>
              {{ option.clientName }}
            </span>
          </div>
        </template>
      </DropdownSelect>
    </div>
    <div>
      <DropdownSettings>
        <div class="option">
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
          <span class="option-text">Изменить</span>
        </div>
      </DropdownSettings>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import DropdownSelect from "src/components/Shared/DropdownSelect.vue";

import ClientService from "src/services/ClientService";
import DropdownSettings from "src/components/Shared/DropdownSettings.vue";

const inputValue = ref("");
</script>

<style lang="scss">
.body-bg {
  background-color: $body-bg;
}
.option-content {
  display: flex;
  align-items: center;
  column-gap: 8px;
}
.image-wrapper {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}
</style>
