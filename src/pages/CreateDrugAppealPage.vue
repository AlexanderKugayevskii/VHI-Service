<template>
  <q-dialog
    full-height
    maximized
    no-backdrop-dismiss
    no-esc-dismiss
    ref="createAppealModalRef"
    class="create-appeal-modal"
    :key="route.params.id"
    v-model:="createAppealModalFixed"
  >
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="page-title q-my-none q-mb-md">
            {{ $t("create_appeal.title") }}
            {{ clientData.appealId ? `№ ${clientData.appealId}` : "" }}
          </h4>
          <StatusBar
            :status="clientData.appealStatus"
            :label="true"
          ></StatusBar>
        </div>
        <div class="create-appeal-body">
          <div class="create-appeal-row">
            <div class="create-appeal-left">
              <div class="create-appeal-client-info">
                <div class="create-appeal-client-text">
                  <span
                    >ID: <b>{{ clientData.dmsCode }} </b></span
                  >
                  <span
                    >Клиент:
                    <b
                      >{{
                        clientData.clientFirstname +
                        " " +
                        clientData.clientLastname
                      }}
                    </b></span
                  >
                  <span
                    >Программа: <b>{{ clientData.program }} </b></span
                  >

                  <!-- <span
                      >Родственник: <b>{{ clientData.clientName }} </b></span
                    > -->
                </div>
                <div class="create-appeal-client-action">
                  <q-btn dense flat :ripple="false" class="btn--no-hover">
                    <q-icon size="20px">
                      <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.16675 10.5C9.16675 10.721 9.25455 10.933 9.41083 11.0892C9.56711 11.2455 9.77907 11.3333 10.0001 11.3333C10.2211 11.3333 10.4331 11.2455 10.5893 11.0892C10.7456 10.933 10.8334 10.721 10.8334 10.5C10.8334 10.279 10.7456 10.067 10.5893 9.91073C10.4331 9.75445 10.2211 9.66666 10.0001 9.66666C9.77907 9.66666 9.56711 9.75445 9.41083 9.91073C9.25455 10.067 9.16675 10.279 9.16675 10.5Z"
                          stroke="#7A88A6"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9.16675 16.3333C9.16675 16.5543 9.25455 16.7663 9.41083 16.9226C9.56711 17.0789 9.77907 17.1667 10.0001 17.1667C10.2211 17.1667 10.4331 17.0789 10.5893 16.9226C10.7456 16.7663 10.8334 16.5543 10.8334 16.3333C10.8334 16.1123 10.7456 15.9004 10.5893 15.7441C10.4331 15.5878 10.2211 15.5 10.0001 15.5C9.77907 15.5 9.56711 15.5878 9.41083 15.7441C9.25455 15.9004 9.16675 16.1123 9.16675 16.3333Z"
                          stroke="#7A88A6"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9.16675 4.66668C9.16675 4.88769 9.25455 5.09965 9.41083 5.25593C9.56711 5.41221 9.77907 5.50001 10.0001 5.50001C10.2211 5.50001 10.4331 5.41221 10.5893 5.25593C10.7456 5.09965 10.8334 4.88769 10.8334 4.66668C10.8334 4.44566 10.7456 4.2337 10.5893 4.07742C10.4331 3.92114 10.2211 3.83334 10.0001 3.83334C9.77907 3.83334 9.56711 3.92114 9.41083 4.07742C9.25455 4.2337 9.16675 4.44566 9.16675 4.66668Z"
                          stroke="#7A88A6"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </q-icon>
                  </q-btn>
                </div>
              </div>
              <div class="create-appeal-form">
                <div class="tabs-container">
                  <div class="tabs-header q-mb-md">
                    <q-tabs dense active-class="tab-active" v-model="tab">
                      <q-tab
                        name="drugs"
                        label="Лекарства"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                      <q-tab
                        name="drugstore"
                        :label="`${$t('create_appeal.tabs.drugstore')}`"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                    </q-tabs>
                  </div>
                  <div class="tabs-content appeal-content">
                    <keep-alive>
                      <q-tab-panels
                        v-model="tab"
                        animated
                        transition-next="jump-right"
                        transition-prev="jump-left"
                      >
                        <q-tab-panel name="drugs" key="drugs">
                          <div class="tab-header drugstore-header">
                            <UploadImage
                              @image-upladed="handleImage"
                              :value="
                                appealStore.drugAppealImage?.readerPhoto ?? ''
                              "
                            ></UploadImage>
                          </div>
                          <div class="tab-body">
                            <div class="drugstore-form q-mb-sm">
                              <DropdownSelectNew
                                ref="drugstoreDropdownRef"
                                class="drugstore-form-drugname"
                                label="Лекарство"
                                :multiple="false"
                                :debounce-time="300"
                                :loading="appealStore.loading"
                                :options="appealStore.drugs"
                                :selected-options="selectedDrug"
                                :local-search="false"
                                @request="appealStore.fetchDrugs"
                                @request-by-search="handleSearchDrugs"
                                @select-option="handleSelectDrug"
                              >
                                <template #top-label> Лекарство </template>
                                <template #placeholder>
                                  Выберите лекарство
                                </template>
                                <template v-slot:selected-options-once="props">
                                  <div>{{ props.option.name }}</div>
                                </template>
                                <template v-slot:option-content="props">
                                  <div>{{ props.option.name }}</div>
                                </template>
                                <template v-slot:action>
                                  <SimpleButton
                                    type="button"
                                    label="добавить лекарство"
                                    customClass="btn-action"
                                    @click="handleAddCustomDrug"
                                    full-width
                                  ></SimpleButton>
                                </template>
                              </DropdownSelectNew>
                              <SimpleInput
                                label="Кол-во"
                                placeholder="0"
                                class="drugstore-form-amount"
                                number
                                v-model:model-value="drugAmount"
                              ></SimpleInput>
                              <SimpleInput
                                class="drugstore-form-price"
                                label="Цена"
                                placeholder="0"
                                number
                                v-model:model-value="drugPrice"
                              ></SimpleInput>
                              <SimpleButton
                                label="Добавить"
                                type="button"
                                customClass="btn-add"
                                class="drugstore-form-btn-wrapper"
                                @click="handleAddDrugData"
                                :disabled="disableAddButton"
                              ></SimpleButton>
                            </div>

                            <SelectListItem
                              v-for="drug in appealStore.selectedDrugs"
                              :item="drug"
                              :key="drug.id"
                              :is-agent="appealStore.isAgent"
                              @update:status="
                                (item) => handleStatusDrugs(item, false)
                              "
                              @update:progress="
                                (item) => handleStatusDrugs(item, false)
                              "
                            >
                              <template #label>
                                {{ drug.name }}
                              </template>
                              <template #quantity>
                                {{ drug?.quantity ?? drug.pivot.quantity }} шт
                              </template>
                              <template #price>
                                {{ formatPrice(drug.pivot.price) }}
                              </template>
                            </SelectListItem>
                            <div
                              class=""
                              v-if="appealStore.suggestedDrugs.length > 0"
                            >
                              <p
                                class="added-by-title"
                                v-if="!appealStore.isDrugstore"
                              >
                                Добавлено аптекой
                              </p>
                              <p class="added-by-title" v-else>
                                Добавлено компанией
                              </p>
                              <SelectListItem
                                v-for="drug in appealStore.suggestedDrugs"
                                :item="drug"
                                :key="drug.id"
                                :isAgent="appealStore.isAgent"
                                @update:status="
                                  (item) => handleStatusDrugs(item, true)
                                "
                                @update:progress="
                                  (item) => handleStatusDrugs(item, true)
                                "
                              >
                                <template #label>
                                  {{ drug.name }}
                                </template>
                                <template #quantity>
                                  {{ drug?.quantity ?? drug.pivot.quantity }} шт
                                </template>
                                <template
                                  #price
                                  v-if="!appealStore.isDrugstore"
                                >
                                  {{ formatPrice(Number(drug.pivot.price)) }}
                                </template>
                              </SelectListItem>
                            </div>
                          </div>
                        </q-tab-panel>
                        <q-tab-panel name="drugstore" key="drugstore">
                          <div class="tab-header">
                            <DropdownSelectNew
                              class="dropdown-space"
                              :label="
                                appealStore.isDrugstore
                                  ? 'Ваша аптека'
                                  : 'Аптека'
                              "
                              :multiple="false"
                              :loading="appealStore.loading"
                              :options="appealStore.drugstores"
                              :disable-choise="
                                appealStore.isDrugstore ||
                                appealStore.typeOfAppeal === 1
                              "
                              :selected-options="appealStore.selectedDrugstore"
                              @select-option="appealStore.selectDrugstore"
                              @request="appealStore.fetchDrugstores"
                            >
                              <template #top-label> Аптека </template>
                              <template #placeholder v-if="appealStore.isAgent">
                                Выберите аптеку
                              </template>
                              <template v-slot:selected-options-once="props">
                                <div>{{ props.option.name }}</div>
                              </template>
                              <template v-slot:option-content="props">
                                <div>{{ props.option.name }}</div>
                                <CheckIcon
                                  v-if="
                                    appealStore.checkSelectedDrugstore(
                                      props.option
                                    )
                                  "
                                />
                              </template>
                            </DropdownSelectNew>
                          </div>
                          <div class="tab-body"></div>
                        </q-tab-panel>
                      </q-tab-panels>
                    </keep-alive>
                  </div>
                </div>

                <div class="create-appeal-actions">
                  <div class="create-appeal-actions-btns">
                    <SimpleButton
                      v-if="appealStore.typeOfAppeal === 0"
                      :label="$t('create_appeal.buttons.save_appeal')"
                      type="submit"
                      customClass="btn-action"
                      :loading="appealStore.loading"
                      :disabled="!appealStore.selectedDrugstore"
                      @click="handleCreateAppeal"
                    >
                      <template #loading-spinner>
                        <LoadingSpinner />
                      </template>
                    </SimpleButton>
                    <SimpleButton
                      v-else
                      :label="$t('create_appeal.buttons.save_appeal')"
                      type="submit"
                      customClass="btn-action"
                      :loading="appealStore.loading"
                      @click="handleChangeAppeal"
                    >
                      <template #loading-spinner> <LoadingSpinner /> </template
                    ></SimpleButton>
                    <SimpleButton
                      :label="$t('create_appeal.buttons.exit_appeal')"
                      type="button"
                      customClass="btn-cancel"
                      @click="hideModal"
                    ></SimpleButton>
                  </div>
                  <div
                    class="create-appeal-action-expences"
                    v-if="!appealStore.isClinic"
                  >
                    <span class="create-appeal-action-expences-title"
                      >Общий расход:
                    </span>

                    <span class="create-appeal-action-expences-total">{{
                      formatPrice(appealStore.appealTotalDrugConsumption)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="create-appeal-right">
              <div class="create-appeal-interaction"></div>
            </div>
          </div>
        </div>
        <div class="create-appeal-close">
          <button class="create-appeal-close-btn" @click="hideModal">
            <q-icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M11 1L1 11"
                  stroke="#7A88A6"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M1 1L11 11"
                  stroke="#7A88A6"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </q-icon>
          </button>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import StatusBar from "src/components/Shared/StatusBar.vue";
import DropdownSelectNew from "src/components/Shared/DropdownSelectNew.vue";
import UploadImage from "src/components/Shared/UploadImage.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import SelectedItem from "src/components/Shared/SelectedItem.vue";
import SelectListItem from "src/components/Shared/SelectListItem.vue";
import CheckIcon from "src/components/Shared/CheckIcon.vue";
import LoadingSpinner from "src/components/Shared/LoadingSpinner.vue";
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppealStore } from "src/stores/appealStore.js";
import { useAuthStore } from "src/stores/authStore";
import Trans from "src/i18n/translation";
import { storeToRefs } from "pinia";
import formatPrice from "src/helpers/formatPrice";
import { format } from "quasar";

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const appealStore = useAppealStore();

const { client: clientData, drug: drugData } = storeToRefs(appealStore);
const createAppealModalFixed = ref(true);
const router = useRouter();
const route = useRoute();

const tab = ref("drugs");
const drugstoreDropdownRef = ref(null);
const createAppealModalRef = ref(null);

const selectedDrug = ref(null);
const drugAmount = ref(null);
const drugPrice = ref(null);

const disableAddButton = computed(
  () => !selectedDrug.value || !drugAmount.value || !drugPrice.value
);

const handleSelectDrug = (drug) => (selectedDrug.value = drug);

const handleCreateAppeal = () => {
  appealStore.postAppealDrugData();
  appealStore.setTypeOfAppeal("CHANGE");
};
const handleChangeAppeal = () => {
  appealStore.changeAppealDrugData();
};

const handleSearchDrugs = async (name) => {
  await appealStore.fetchDrugs(name);
};

const handleAddCustomDrug = () => {
  selectedDrug.value = {
    name: drugstoreDropdownRef.value.searchValue,
    id: null,
  };
  drugstoreDropdownRef.value.closeModal();
};

const handleAddDrugData = () => {
  const drugData = {
    id: selectedDrug.value.id,
    name: selectedDrug.value.name,
    quantity: +drugAmount.value,
    price: +drugPrice.value,
  };

  appealStore.selectDrugs(drugData);
  selectedDrug.value = null;
  drugAmount.value = null;
  drugPrice.value = null;
};

const handleImage = (image) => {
  console.log(image);
  appealStore.setDrugAppealImage(image);
};

const hideModal = () => {
  createAppealModalRef.value.hide();
  appealStore.clearAppealData();
  appealStore.clearDrugstoreData();
  router.replace(Trans.i18nRoute({ name: "drugstore-page" }));
};

const handleStatusDrugs = (item, isSuggested) => {
  appealStore.changeStatusDrugs(item, isSuggested);
};

watch(
  () => appealStore.successAppeal,
  (newVal) => {
    if (newVal) {
      appealStore.setSuccessAppeal(false);
      // createAppealModalRef.value.hide();
      // appealStore.clearAppealData();
      // appealStore.clearClinicData();

      // router.replace(Trans.i18nRoute({ name: "appeals-page" }));
    }
  }
);
</script>

<style lang="scss" scoped>
.create-appeal-modal .modal-container {
  width: 90%;
  padding: 0;
  position: relative;
  overflow: visible;
}
.create-appeal-modal .modal-header {
  display: block;
  border-top-left-radius: 16px;
  padding: 24px;
}
.create-appeal-modal .modal-content {
  background-color: #edf0f5;
  border-radius: 20px;
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
.create-appeal-body {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.create-appeal-row {
  display: flex;
  flex-grow: 1;
}
.create-appeal-left {
  display: flex;
  flex-direction: column;
  flex-basis: 70%;
}
.create-appeal-client-info {
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
}
.create-appeal-client-text {
  flex-grow: 1;
  display: flex;
  column-gap: 16px;

  span {
    font-size: 15px;
    color: #404f6f;
    b {
      font-weight: 500;
    }
  }
}
.create-appeal-form {
  flex: 1;
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.create-appeal-close {
  position: absolute;
  left: -48px;
  top: 20px;
  z-index: 100;
  &-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    border: none;
    background: #fcfeff;
    outline: none;
    cursor: pointer;
  }
}
.appeal-dropdown {
  margin-bottom: 20px;
}
.tabs-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
.q-tab {
  height: 44px;
  flex: 1;
}
.q-tab-panel {
  overflow: hidden;
}
.tabs-content {
  height: 100%;
  display: flex;
}
.q-tab-panels {
  flex-grow: 1;
}
.q-panel > div {
  height: auto;
}

.tab-header {
  height: 100%;
  margin-bottom: 12px;
}
.create-appeal-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.create-appeal-actions-btns {
  display: flex;
  align-items: center;
  column-gap: 8px;
}
.create-appeal-action-expences {
  font-size: 18px;
  line-height: 22px;
}
.create-appeal-action-expences-title {
  font-weight: 500;
}
.create-appeal-action-expences-total {
  font-weight: 700;
}

.option-content-extra {
  color: #1a2133;
}
.dropdown-button-btn-text-selected {
  color: #404f6f;
}

.drugstore-form {
  display: flex;
  column-gap: 8px;
  align-items: flex-end;
  > div {
    width: auto;
  }
  &-drugname {
    flex-grow: 1;
  }
  &-amount {
    flex-basis: 15%;
  }
  &-type {
    flex-basis: 25%;
  }
  &-price {
    flex-basis: 25%;
  }
  &-btn-wrapper {
  }
}
.drugstore-header {
  margin-bottom: 20px;
}
.dropdown-space {
  margin-bottom: 20px;
}
.price {
  color: #1a2133;
}
.added-by-title {
  font-size: 13px;
  font-weight: 600;
  color: #404f6f;
  margin: 12px 0 8px;
}
.disabled-option {
  opacity: 0.7;
}
</style>
