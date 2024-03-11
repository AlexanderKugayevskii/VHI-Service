<template>
  <q-page class="flex flex-center column body-bg">
    <StatusBar :label="true"></StatusBar>
    <div class="test-width">
      <DropdownSelectNew
        label="выберите клинику"
        :multiple="false"
        :loading = "appealStore.loading"
        :options="appealStore.clinics"
        :selected-options="appealStore.selectedClinic"
        @select-option="appealStore.selectClinic"
        @request="appealStore.fetchClinics"
      >
        <template #placeholder> Выберете клинику </template>
        <template v-slot:selected-options-once="props">
          <div>{{ props.option.name }}</div>
        </template>
        <template v-slot:option-content="props">
          <div>{{ props.option.name }}</div>
          <CheckIcon v-if="testStore.checkSelectOption(props.option)" />
        </template>
      </DropdownSelectNew>
    </div>

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
      <DragNdrop></DragNdrop>
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
import TestComponent from "src/components/Shared/TestComponent.vue";
import DragNdrop from "src/components/DragNdrop.vue";
import DropdownSelectNew from "src/components/Shared/DropdownSelectNew.vue";
import CheckIcon from "src/components/Shared/CheckIcon.vue";
import { useCounterStore } from "src/stores/example-store";
import { useAppealStore } from "src/stores/appealStore";
const inputValue = ref("");
const handleTest = (options) => {
  console.log(options);
};

const appealStore = useAppealStore();
const testStore = useCounterStore();
console.log(testStore);
</script>

<style lang="scss">
.body-bg {
  background-color: $body-bg;
}

.test-width {
  width: 300px;
}
</style>
