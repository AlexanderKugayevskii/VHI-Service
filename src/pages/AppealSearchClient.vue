<template>
  <q-dialog ref="appealSearchClientRef" no-backdrop-dismiss>
    <div class="modal-container appeal-search-container">
      <div class="modal-header">
        <h4 class="page-title q-my-none">{{ $t("appeal_search.title") }}</h4>
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
              :label="$t('appeal_search.fio')"
              :ripple="false"
              class="tab--no-hover"
            />
            <q-tab
              name="byPassport"
              :label="$t('appeal_search.passport')"
              :ripple="false"
              class="tab--no-hover"
            />
          </q-tabs>
        </div>
        <div class="tabs-content">
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            transition-next="fade"
            transition-prev="fade"
          >
            <q-tab-panel name="byId">
              <div class="tab-header">
                <SimpleInput
                  label="ID"
                  :placeholder="$t('appeal_search.id_input')"
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
                  :checked="selectedClient?.id === client.id"
                  @update:select-value="handleSelectItem"
                ></SearchClientResult>
              </div>
            </q-tab-panel>

            <q-tab-panel name="byName">
              <div class="tab-header">
                <SimpleInput
                  :label="$t('appeal_search.fio_label')"
                  debounce-time="300"
                  :placeholder="$t('appeal_search.fio_input')"
                  v-model:model-value="searchName"
                  :show-icon="true"
                >
                </SimpleInput>
              </div>
              <div class="client-results">
                <SearchClientResult
                  v-for="client in clientStore.searchClients"
                  :item="client"
                  :key="client.clientID"
                  :checked="selectedClient?.id === client.id"
                  @update:select-value="handleSelectItem"
                ></SearchClientResult>
              </div>
            </q-tab-panel>

            <q-tab-panel name="byPassport">
              <div class="tab-header">
                <PassportInput
                  :label="$t('appeal_search.passport_label')"
                  debounce-time="300"
                  :placeholder="$t('appeal_search.passport_input')"
                  :show-icon="true"
                  @update:model-value="handleInput"
                >
                </PassportInput>
              </div>
              <div class="client-results">
                <SearchClientResult
                  v-for="client in clientStore.searchClients"
                  :item="client"
                  :key="client.clientID"
                  :checked="selectedClient?.id === client.id"
                  @update:select-value="handleSelectItem"
                ></SearchClientResult>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
      <div class="modal-footer">
        <SimpleButton
          :label="$t('appeal_search.cancel')"
          custom-class="btn-cancel"
          @click="hideModal"
        />
        <SimpleButton
          :label="$t('create_appeal.buttons.create_appeal')"
          :custom-class="[
            'btn-action',
            selectedClient === null ? 'btn--disabled' : '',
          ]"
          :disabled="selectedClient === null"
          @click="goToAppeal"
        ></SimpleButton>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import PassportInput from "src/components/Shared/PassportInput.vue";
import SearchClientResult from "src/components/Shared/SearchClientResult.vue";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppealStore } from "src/stores/appealStore";
import { useSearchClientsStore } from "src/stores/clientSearchStore";
import Trans from "src/i18n/translation";

const searchId = ref("");
const searchName = ref("");
const searchPassport = ref("");
const selectedClient = ref(null);
const tab = ref("byId");
const appealSearchClientRef = ref(null);

const clientStore = useSearchClientsStore();
const appealStore = useAppealStore();

const router = useRouter();
const handleInput = (val) => {
  searchPassport.value = val;
};

const clearFields = () => {
  searchId.value = "";
  searchName.value = "";
  searchPassport.value = "";
};

const hideModal = () => {
  appealSearchClientRef.value.hide();
  clientStore.$resetSearchClients();
  selectedClient.value = null;
  searchId.value = "";
};

const handleSelectItem = (item) => {
  selectedClient.value = item;
  appealStore.setClient(selectedClient.value);
};

const goToAppeal = async () => {
  await appealStore.setClinic();
  appealStore.setTypeOfAppeal("NEW");
  router.replace(
    Trans.i18nRoute({
      name: "createAppeal",
      params: {
        id: selectedClient.value.id,
      },
    })
  );
  hideModal();
};

watch(tab, (newTab) => {
  clearFields();
});
watch([searchId, searchName, searchPassport], (newVal) => {
  const checkEmptyFields = newVal.every((val) => val.length === 0);
  const [newSearchId, newSearchName, newSearchPassport] = newVal;
  if (checkEmptyFields) {
    clientStore.$resetSearchClients();
    return;
  }

  if (newSearchId.length > 0) {
    clientStore.getClientByCode(newSearchId);
  }
  if (newSearchName.length > 0) {
    clientStore.getClientByName(newSearchName);
  }
  if (newSearchPassport.length > 0) {
    clientStore.getClientByPassport(newSearchPassport);
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
