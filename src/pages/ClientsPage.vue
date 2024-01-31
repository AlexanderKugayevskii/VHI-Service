<template>
  <q-page class="flex flex-center column body-bg">
    <StatusBar :label="true"></StatusBar>

    <h1>Клиенты</h1>
    <div class="full-width q-mb-md">
      <SimpleInput v-model="inputValue" debounce-time="500"></SimpleInput>
    </div>

    <div class="full-width">
      <DropdownSelect
        :fetch-function="ClientService.getClientsBySearch"
        label="Клиника"
        id-key="clientID"
        nameKey="clientName"
        :multiple="true"
        @update:selected-options="handleTest"
      >
        <template #placeholder> Выберете клинику </template>
        <template #selected-options-once="{ option }">
          {{ option.clientName }}
        </template>
        <template #selected-options-length="{ length }">
          Выбрано {{ length }} клиник
        </template>
        <template #option-content="{ option, checked }">
          <div class="option-content">
            <div class="image-wrapper">
              <img src="/src/assets/temp/propfmedservice.png" />
            </div>
            <span>
              {{ option.clientName }}
            </span>
            <q-icon v-if="checked">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
              >
                <path
                  d="M1 6L6 11L16 1"
                  stroke="#13B8BA"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </q-icon>
          </div>
        </template>
      </DropdownSelect>
    </div>
    <div class="test-width">
      <DropdownSelectLocal
        label="Статус"
        placeholder="Выберите статус"
        id-key="statusName"
        :multiple="false"
        :initialOptions="[
          { id: 1, statusName: 'Новое' },
          { id: 2, statusName: 'В работе' },
          { id: 3, statusName: 'Завершено' },
        ]"
      >
        <template #option-content="{ option, checked }">
          <div class="option-content">
            <span>
              {{ option.statusName }}
            </span>
            <q-icon v-if="checked">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="12"
                viewBox="0 0 17 12"
                fill="none"
              >
                <path
                  d="M1 6L6 11L16 1"
                  stroke="#13B8BA"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </q-icon>
          </div>
        </template>
      </DropdownSelectLocal>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import DropdownSelect from "src/components/Shared/DropdownSelect.vue";
import DropdownSelectLocal from "src/components/Shared/DropdownSelectLocal.vue";
import ClientService from "src/services/ClientService";
import StatusBar from "src/components/Shared/StatusBar.vue";
const inputValue = ref("");
const handleTest = (options) => {
  console.log(options);
};
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
.test-width {
  width: 300px;
}
</style>
