<template>
  <q-dialog ref="appealSearchClientRef" no-backdrop-dismiss>
    <div class="modal-container appeal-search-container">
      <div class="modal-header">
        <h4 class="page-title q-my-none">Поиск клиента</h4>
        <button type="button" class="btn-close" @click="hideModal">
          <q-icon size="20px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M11 1L1 11"
                stroke="#D0D8E6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 1L11 11"
                stroke="#D0D8E6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </q-icon>
        </button>
      </div>
      <div class="modal-body">
        <div class="tabs-header q-mb-md">
          <q-tabs dense active-class="tab-active" v-model="tab">
            <q-tab
              name="byId"
              label="ID"
              :ripple="false"
              class="tab--no-hover"
            />
            <q-tab
              name="byName"
              label="Фамилия и Имя"
              :ripple="false"
              class="tab--no-hover"
            />
            <q-tab
              name="byPassport"
              label="Паспорт"
              :ripple="false"
              class="tab--no-hover"
            />
          </q-tabs>
        </div>
        <div class="tabs-content">
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="byId">
              <div class="tab-header">
                <SimpleInput
                  label="ID"
                  placeholder="Введите ID клиента"
                  debounce-time="300"
                  v-model:model-value="searchId"
                  :show-icon="true"
                ></SimpleInput>
              </div>
              <div class="client-results">
                <SearchClientResult
                  v-for="client in clientStore.searchClients"
                  :item="client"
                  :key="client.clientID"
                  :checked="selectedClient?.clientID === client.clientID"
                  @update:select-value="handleSelectItem"
                ></SearchClientResult>
              </div>
            </q-tab-panel>

            <q-tab-panel name="byName">
              <div class="tab-header">
                <SimpleInput
                  label="Фамилия Имя"
                  placeholder="Введите Фамилию и Имя клиента"
                  :show-icon="true"
                >
                </SimpleInput>
              </div>
            </q-tab-panel>

            <q-tab-panel name="byPassport">
              <div class="tab-header">
                <SimpleInput
                  label="Серия и номер паспорта"
                  placeholder="Введите серию и номер паспорта"
                  :show-icon="true"
                >
                </SimpleInput>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
      <div class="modal-footer">
        <SimpleButton
          label="Отмена"
          custom-class="btn-cancel"
          @click="hideModal"
        />
        <SimpleButton
          label="Создать обращение"
          :custom-class="[
            'btn-action',
            selectedClient === null ? 'btn--disabled' : '',
          ]"
          :disabled="selectedClient === null"
        ></SimpleButton>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import SearchClientResult from "src/components/Shared/SearchClientResult.vue";
import { ref, watch } from "vue";

import { useClientsStore } from "src/stores/clientsStore";
const searchId = ref("");
const selectedClient = ref(null);
const tab = ref("byId");
const appealSearchClientRef = ref(null);

const clientStore = useClientsStore();

const hideModal = () => {
  appealSearchClientRef.value.hide();
  clientStore.$resetSearchClients();
  selectedClient.value = null;
};

const handleSelectItem = (item) => {
  selectedClient.value = item;
  console.log(selectedClient.value);
};

watch(searchId, (newVal) => {
  if (newVal.length > 0) {
    clientStore.getClientsForAppealByPassport(newVal);
  } else {
    clientStore.$resetSearchClients();
  }
});
</script>

<style lang="scss" scoped>
.appeal-search-container {
  min-width: 600px;
}
.tab-header {
  margin-bottom: 20px;
}
</style>
