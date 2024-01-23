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
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import DropdownSelect from "src/components/Shared/DropdownSelect.vue";

import ClientService from "src/services/ClientService";

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
