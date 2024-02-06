<template>
  <q-dialog
    full-height
    maximized
    no-backdrop-dismiss
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
          </h4>
          <StatusBar
            :status="appealStore.client?.appealStatus ?? 'NEW'"
            :label="true"
          ></StatusBar>
        </div>
        <div class="create-appeal-body">
          <div class="create-appeal-row">
            <div class="create-appeal-left">
              <div class="create-appeal-client-info">
                <div class="create-appeal-client-text">
                  <span
                    >ID:
                    <b>{{ clientData.userID ?? "1/44/23/11/66" }} </b></span
                  >
                  <span
                    >Клиент: <b>{{ clientData.clientName }} </b></span
                  >
                  <span
                    >Программа: <b>{{ clientData.program }} </b></span
                  >
                  <span
                    >Родственник: <b>{{ clientData.clientName }} </b></span
                  >
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
                        name="clinics"
                        :label="$t('create_appeal.tabs.clinic')"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                      <q-tab
                        name="doctors"
                        :label="$t('create_appeal.tabs.doctors')"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                      <q-tab
                        name="services"
                        :label="$t('create_appeal.tabs.services')"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                      <q-tab
                        name="drugstore"
                        :label="$t('create_appeal.tabs.drugstore')"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                    </q-tabs>
                  </div>
                  <div class="tabs-content">
                    <keep-alive>
                      <q-tab-panels v-model="tab" animated>
                        <q-tab-panel name="clinics" key="clinics">
                          <div class="tab-header">
                            <DropdownSelect
                              label="Клиника"
                              :placeholder="
                                $t('create_appeal.dropdowns.clinic')
                              "
                              class="appeal-dropdown"
                              id-key="id"
                              name-key="clinicName"
                              :multiple="false"
                              :fetch-function="appealStore.fetchClinics"
                              @update:selected-options="appealStore.setClinic"
                            >
                              <template #placeholder>
                                <span
                                  v-if="appealStore.clinic?.length"
                                  class="dropdown-button-btn-text-selected"
                                >
                                  {{ appealStore.clinic[0].clinicName }}
                                </span>
                                <span v-else>
                                  {{ $t("create_appeal.dropdowns.clinic") }}
                                </span>
                              </template>
                              <template #selected-options-once="{ option }">
                                {{ option.clinicName }}
                              </template>
                              <template #option-content="{ option }">
                                <div class="option-content">
                                  <div class="image-wrapper">
                                    <img
                                      src="/src/assets/temp/propfmedservice.png"
                                    />
                                  </div>
                                  <span>
                                    {{ option.clinicName }}
                                  </span>
                                  <q-icon
                                    v-if="
                                      appealStore.clinic?.some((clinic) => {
                                        return clinic.id === option.id;
                                      })
                                    "
                                  >
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
                            <SimpleInput
                              label="Диагноз"
                              placeholder="Введите диагноз"
                              @update:model-value="appealStore.setDiagnosis"
                              :modelValue="appealStore.diagnosisData"
                            ></SimpleInput>
                          </div>
                        </q-tab-panel>

                        <q-tab-panel name="doctors" key="doctors">
                          <div class="tab-header">
                            <DropdownSelect
                              :placeholder="
                                $t('create_appeal.dropdowns.doctors')
                              "
                              id-key="id"
                              name-key="doctorName"
                              :multiple="true"
                              :selected-data="doctorsData"
                              :fetch-function="appealStore.fetchDoctors"
                              @update:selected-options="appealStore.setDoctors"
                            >
                              <template #placeholder>
                                <span
                                  v-if="appealStore.doctorsData?.length > 0"
                                  class="dropdown-button-btn-text-selected"
                                >
                                  {{
                                    doctorsData.length === 1
                                      ? doctorsData[0].specialization
                                      : $t(
                                          "create_appeal.dropdowns.doctors_choise",
                                          doctorsData.length
                                        )
                                  }}
                                </span>
                                <span v-else>
                                  {{ $t("create_appeal.dropdowns.doctors") }}
                                </span>
                              </template>
                              <template #selected-options-once="{ option }">
                                {{ option.specialization }}
                              </template>
                              <template #selected-options-length="{ length }">
                                {{
                                  $t(
                                    "create_appeal.dropdowns.doctors_choise",
                                    length
                                  )
                                }}
                              </template>
                              <template #option-content="{ option }">
                                <div class="option-content">
                                  <span>
                                    {{ option.specialization }}
                                  </span>
                                  -
                                  <span class="option-content-extra">
                                    {{ formatPrice(option.price) }}
                                  </span>
                                  <q-icon
                                    v-if="
                                      appealStore.doctorsData?.some(
                                        (doctor) => doctor.id === option.id
                                      )
                                    "
                                  >
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
                          <div class="tab-body">
                            <SelectedItem
                              v-for="item in doctorsData"
                              :item="item"
                              :key="item.id"
                              @update:select="handleRemoveDoctor"
                            >
                              <template #label>
                                {{ item.specialization }}
                              </template>
                            </SelectedItem>
                          </div>
                        </q-tab-panel>

                        <q-tab-panel name="services" key="services">
                          <div class="tab-header">
                            <DropdownSelect
                              :placeholder="
                                $t('create_appeal.dropdowns.services')
                              "
                              id-key="id"
                              name-key="serviceName"
                              :multiple="true"
                              :selected-data="appealStore.servicesData"
                              :fetch-function="appealStore.fetchServices"
                              @update:selected-options="appealStore.setServices"
                            >
                              <template #placeholder>
                                <span
                                  v-if="appealStore.servicesData?.length > 0"
                                  class="dropdown-button-btn-text-selected"
                                >
                                  {{
                                    appealStore.servicesData.length === 1
                                      ? appealStore.servicesData[0].serviceName
                                      : `${$t(
                                          "create_appeal.dropdowns.services_choise",
                                          appealStore.servicesData.length
                                        )} `
                                  }}
                                </span>
                                <span v-else>
                                  {{ $t("create_appeal.dropdowns.services") }}
                                </span>
                              </template>
                              <template #selected-options-once="{ option }">
                                {{ option.serviceName }}
                              </template>
                              <template #selected-options-length="{ length }">
                                {{
                                  $t(
                                    "create_appeal.dropdowns.services_choise",
                                    length
                                  )
                                }}
                              </template>
                              <template #option-content="{ option }">
                                <div class="option-content">
                                  <span>
                                    {{ option.serviceName }}
                                  </span>
                                  -
                                  <span class="option-content-extra">
                                    {{ formatPrice(option.price) }}
                                  </span>
                                  <q-icon
                                    v-if="
                                      appealStore.servicesData?.some(
                                        (service) => service.id === option.id
                                      )
                                    "
                                  >
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
                          <div class="tab-body">
                            <SelectedItem
                              v-for="item in servicesData"
                              :item="item"
                              :key="item.id"
                              @update:select="handleRemoveService"
                            >
                              <template #label>
                                {{ item.serviceName }}
                              </template>
                            </SelectedItem>
                          </div>
                        </q-tab-panel>

                        <q-tab-panel name="drugstore" key="drugstore">
                          <div class="tab-header drugstore-header">
                            <DragNdrop></DragNdrop>
                          </div>
                          <div class="tab-body">
                            <div class="drugstore-form">
                              <SimpleInput
                                label="Лекарство"
                                placeholder="Название лекарства"
                                class="drugstore-form-drugname"
                                @update:model-value="appealStore.setDrugName"
                                :modelValue="drugData.drugName"
                              ></SimpleInput>
                              <SimpleInput
                                label="Кол-во"
                                placeholder="0"
                                class="drugstore-form-amount"
                                @update:model-value="appealStore.setDrugAmount"
                                :modelValue="drugData.drugAmount"
                              ></SimpleInput>
                              <DropdownSelectLocal
                                class="drugstore-form-type"
                                label="Ед. изм"
                                placeholder="Шт"
                                id-key="drugType"
                                :multiple="false"
                                :initialOptions="[
                                  { id: 1, drugType: 'Шт' },
                                  { id: 2, drugType: 'Мл' },
                                ]"
                                @update:selectedOptions="
                                  appealStore.setDrugType
                                "
                              >
                                <template #option-content="{ option }">
                                  <div class="option-content">
                                    <span>
                                      {{ option.drugType }}
                                    </span>
                                  </div>
                                </template>
                              </DropdownSelectLocal>
                              <SimpleInput
                                class="drugstore-form-price"
                                label="Цена"
                                placeholder="0"
                                @update:model-value="appealStore.setDrugPrice"
                                :model-value="drugData.drugAmount"
                              ></SimpleInput>
                              <SimpleButton
                                label="Добавить"
                                type="button"
                                customClass="btn-add"
                                class="drugstore-form-btn-wrapper"
                                @click="handleAddDrug"
                              ></SimpleButton>
                            </div>
                            <SelectedItem
                              v-for="(item, index) in drugsData"
                              :item="item"
                              :key="index"
                              @update:select="handleRemoveDrug"
                            >
                              <template #label>
                                {{ item.drugName }}
                              </template>
                            </SelectedItem>
                          </div>
                          {{ drugsData }}
                        </q-tab-panel>
                      </q-tab-panels>
                    </keep-alive>
                  </div>
                </div>

                <div class="create-appeal-actions">
                  <div class="create-appeal-actions-btns">
                    <SimpleButton
                      :label="$t('create_appeal.buttons.save_appeal')"
                      type="submit"
                      customClass="btn-action"
                    ></SimpleButton>
                    <SimpleButton
                      :label="$t('create_appeal.buttons.exit_appeal')"
                      type="button"
                      customClass="btn-cancel"
                      @click="hideModal"
                    ></SimpleButton>
                  </div>
                  <div class="create-appeal-action-expences">
                    <span class="create-appeal-action-expences-title"
                      >Общий расход:
                    </span>

                    <span class="create-appeal-action-expences-total"
                      >2 020 000</span
                    >
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
import DropdownSelect from "src/components/Shared/DropdownSelect.vue";
import DropdownSelectLocal from "src/components/Shared/DropdownSelectLocal.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import SelectedItem from "src/components/Shared/SelectedItem.vue";
import DragNdrop from "src/components/DragNdrop.vue";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppealStore } from "src/stores/appealStore.js";
import Trans from "src/i18n/translation";
import { storeToRefs } from "pinia";
import formatPrice from "src/helpers/formatPrice";

const appealStore = useAppealStore();
const doctorsData = computed(() => appealStore.doctorsData);
const servicesData = computed(() => appealStore.servicesData);
const drugsData = computed(() => appealStore.drugsData.drugs);
const { client: clientData, drug: drugData } = storeToRefs(appealStore);
console.log(appealStore.drugsData);
const createAppealModalFixed = ref(true);
const router = useRouter();
const route = useRoute();

const tab = ref("clinics");
const createAppealModalRef = ref(null);

const hideModal = () => {
  createAppealModalRef.value.hide();
  router.replace(Trans.i18nRoute({ name: "appeals-page" }));
};

const handleRemoveDoctor = (item) => {
  appealStore.clearDoctors(item);
};
const handleRemoveService = (item) => {
  appealStore.clearServices(item);
};
const handleRemoveDrug = (item) => {
  appealStore.clearDrugs(item);
};
const handleAddDrug = () => {
  appealStore.setDrugs(drugData);
};
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

  > div {
    width: auto;
  }
  &-drugname {
    flex-basis: 245px;
  }
  &-amount {
    flex-basis: 100px;
  }
  &-type {
    flex-basis: 85px;
  }
  &-price {
    flex-basis: 140px;
  }
  &-btn-wrapper {
    align-self: flex-end;
  }
}
.drugstore-header {
  margin-bottom: 20px;
}
</style>
