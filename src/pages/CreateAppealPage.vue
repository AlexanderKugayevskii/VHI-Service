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
          <div class="modal-header-top">
            <h4 class="page-title q-my-none">
              {{ $t("create_appeal.title") }}
              {{ clientData.appealId ? `№ ${clientData.appealId}` : "" }}
            </h4>
            <div class="label-row">
              <span class="title-label green">Клиника</span>
              <span class="title-label violet">Обращения</span>
            </div>
          </div>
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
                    >{{ clientData.type_id === 0 ? "Клиент" : "Родственник" }}:
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

                  <span
                    >Заявитель:
                    <b>{{ clientData.applicant || "Данных нет" }} </b></span
                  >
                  <span
                    >Дата рождения:
                    <b>{{ clientData.birthday || "Данных нет" }} </b></span
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
                        :ripple="false"
                        class="tab--no-hover"
                      >
                        <span>{{ $t("create_appeal.tabs.clinic") }}</span>
                        <!-- <q-badge
                          v-if="appealStore.checkStatusIfRejected"
                          label="требуется комментарий"
                          class="appeal-count-badge appeal-count-badge--negative"
                        /> -->
                      </q-tab>
                      <q-tab
                        name="doctors"
                        :ripple="false"
                        class="tab--no-hover"
                      >
                        <span>{{ $t("create_appeal.tabs.doctors") }}</span>
                        <q-badge
                          v-if="appealStore.actionDoctorStatusCount > 0"
                          :label="appealStore.actionDoctorStatusCount"
                          class="appeal-count-badge"
                        />
                      </q-tab>
                      <q-tab
                        name="services"
                        :ripple="false"
                        class="tab--no-hover"
                      >
                        <span>
                          {{ $t("create_appeal.tabs.services") }}
                        </span>
                        <q-badge
                          v-if="appealStore.actionServiceStatusCount > 0"
                          :label="appealStore.actionServiceStatusCount"
                          class="appeal-count-badge"
                        />
                      </q-tab>
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
                        <q-tab-panel name="clinics" key="clinics">
                          <div class="tab-header">
                            <DropdownSelectNew
                              class="dropdown-space"
                              :label="
                                appealStore.isClinic
                                  ? 'Ваша клиника'
                                  : $t('create_appeal.dropdowns.clinic')
                              "
                              :multiple="false"
                              :loading="appealStore.loading"
                              :options="appealStore.clinics"
                              :disable-choise="
                                appealStore.isClinic ||
                                appealStore.typeOfAppeal === 1
                              "
                              :selected-options="appealStore.selectedClinic"
                              @select-option="appealStore.selectClinic"
                              @request="appealStore.fetchClinics"
                              @requestBySelect="appealStore.fetchHospitalData"
                            >
                              <template #placeholder v-if="user.role.id !== 8">
                                {{ $t("create_appeal.dropdowns.clinic") }}
                              </template>
                              <template v-slot:selected-options-once="props">
                                <div>{{ props.option.name }}</div>
                              </template>
                              <template v-slot:option-content="props">
                                <div>{{ props.option.name }}</div>
                                <CheckIcon
                                  v-if="
                                    appealStore.checkSelectedClinic(
                                      props.option
                                    )
                                  "
                                />
                              </template>
                            </DropdownSelectNew>
                            <TextAreaInput
                              class="dropdown-space diagnosis-input"
                              label="Диагноз"
                              placeholder="Введите диагноз"
                              :disableInput="clientData.appealStatus === 2"
                              @update:model-value="appealStore.setDiagnosis"
                              :modelValue="appealStore.diagnosis"
                            ></TextAreaInput>

                            <DateInput
                              class="dropdown-space"
                              :disableInput="clientData.appealStatus === 2"
                              number
                              label="Дата обращения"
                              placeholder="Введите дату (10-05-2024)"
                              @update:model-value="appealStore.setAppealDate"
                              :modelValue="appealStore.appealDate"
                            ></DateInput>

                            <DateInput
                              class="dropdown-space"
                              v-if="clientData.finishedDate"
                              :disableInput="appealStore.isClinic"
                              number
                              label="Дата завершения"
                              :modelValue="clientData.finishedDate"
                              @update:model-value="appealStore.setFinishedDate"
                            ></DateInput>

                            <TextAreaInput
                              label="Комментарий"
                              :placeholder="
                                appealStore.isClinic
                                  ? 'комментариев нет'
                                  : 'укажите комментарий'
                              "
                              :modelValue="appealStore.comment"
                              @update:model-value="setComment"
                              :disableInput="appealStore.isClinic"
                            />
                          </div>
                        </q-tab-panel>

                        <q-tab-panel name="doctors" key="doctors">
                          <div class="tab-header">
                            <DropdownSelectNew
                              ref="doctorDropdownRef"
                              class="dropdown-space"
                              :multiple="true"
                              :loading="appealStore.loading"
                              :options="appealStore.doctors"
                              :selected-options="appealStore.selectedDoctors"
                              @select-option="appealStore.selectDoctors"
                              :disable-choise="clientData.appealStatus === 2"
                            >
                              <template #placeholder>
                                {{ $t("create_appeal.dropdowns.doctors") }}
                              </template>
                              <template v-slot:selected-options-once="props">
                                <div>{{ props.option.name }}</div>
                              </template>
                              <template
                                v-slot:selected-options-length="{ length }"
                              >
                                {{
                                  $t(
                                    "create_appeal.dropdowns.doctors_choise",
                                    length
                                  )
                                }}
                              </template>
                              <template v-slot:option-content="props">
                                <div
                                  :class="{
                                    'disabled-option':
                                      appealStore.checkSuggestedDoctors(
                                        props.option
                                      ) ||
                                      appealStore.cantRemoveFromSelectedDoctors(
                                        props.option
                                      ),
                                  }"
                                >
                                  <span>
                                    {{ props.option.name }}
                                  </span>
                                  <span class="price">
                                    -
                                    {{ formatPrice(props.option.pivot.price) }}
                                  </span>
                                  <span
                                    v-if="
                                      appealStore.checkSuggestedDoctors(
                                        props.option
                                      )
                                    "
                                  >
                                    (добавлено
                                    {{
                                      appealStore.isClinic
                                        ? "компанией"
                                        : "клиникой"
                                    }})
                                  </span>
                                  <span
                                    v-if="
                                      appealStore.cantRemoveFromSelectedDoctors(
                                        props.option
                                      )
                                    "
                                  >
                                    {{
                                      appealStore.isAgent
                                        ? " (завершено клиникой)"
                                        : " (решение компании)"
                                    }}
                                  </span>
                                </div>
                                <CheckIcon
                                  v-if="
                                    appealStore.checkSelectedDoctors(
                                      props.option
                                    ) &&
                                    !appealStore.cantRemoveFromSelectedDoctors(
                                      props.option
                                    )
                                  "
                                />
                              </template>
                              <template v-slot:action>
                                <SimpleInput
                                  class="dropdown-space"
                                  placeholder="введите стоимость услуги"
                                  @update:model-value="handleDoctorCustomPrice"
                                  :model-value="
                                    doctorCustomPrice.formattedValue
                                  "
                                  number
                                />
                                <SimpleButton
                                  type="button"
                                  label="добавить врача"
                                  customClass="btn-action"
                                  @click="addCustomDoctor"
                                  :disabled="disabledDoctorButton"
                                  full-width
                                ></SimpleButton>
                              </template>
                            </DropdownSelectNew>
                          </div>
                          <div class="tab-body">
                            <SelectListItem
                              v-for="doctor in appealStore.selectedDoctors"
                              :removable="true"
                              :item="doctor"
                              :key="doctor.id"
                              :commonStatus="clientData.appealStatus"
                              :isAgent="appealStore.isAgent"
                              @update:status="
                                (item) => handleStatusDoctor(item, false)
                              "
                              @update:progress="
                                (item) => handleStatusDoctor(item, false)
                              "
                              @update:quantity="
                                (item) => handleStatusDoctor(item, false)
                              "
                              @remove:item="(item) => handleRemoveDoctor(item)"
                            >
                              <template #label>
                                {{ doctor.name }}
                              </template>
                              <template #price>
                                {{ formatPrice(Number(doctor.pivot.price)) }}
                              </template>
                            </SelectListItem>
                            <div
                              class=""
                              v-if="appealStore.suggestedDoctors.length > 0"
                            >
                              <p
                                class="added-by-title"
                                v-if="!appealStore.isClinic"
                              >
                                Добавлено клиникой
                              </p>
                              <p class="added-by-title" v-else>
                                Добавлено компанией
                              </p>
                              <SelectListItem
                                v-for="doctor in appealStore.suggestedDoctors"
                                :item="doctor"
                                :removable="false"
                                :key="doctor.id"
                                :commonStatus="clientData.appealStatus"
                                :isAgent="appealStore.isAgent"
                                @update:status="
                                  (item) => handleStatusDoctor(item, true)
                                "
                                @update:progress="
                                  (item) => handleStatusDoctor(item, true)
                                "
                                @update:quantity="
                                  (item) => handleStatusDoctor(item, true)
                                "
                              >
                                <template #label>
                                  {{ doctor.name }}
                                </template>
                                <template #price>
                                  {{ formatPrice(Number(doctor.pivot.price)) }}
                                </template>
                              </SelectListItem>
                            </div>
                          </div>
                        </q-tab-panel>

                        <q-tab-panel name="services" key="services">
                          <div class="tab-header">
                            <DropdownSelectNew
                              ref="serviceDropdownRef"
                              class="dropdown-space"
                              :multiple="true"
                              :loading="appealStore.loading"
                              :options="appealStore.services"
                              :selected-options="appealStore.selectedServices"
                              @select-option="appealStore.selectServices"
                              :disable-choise="clientData.appealStatus === 2"
                            >
                              <template #placeholder>
                                {{ $t("create_appeal.dropdowns.services") }}
                              </template>
                              <template v-slot:selected-options-once="props">
                                <div>{{ props.option.name }}</div>
                              </template>
                              <template
                                v-slot:selected-options-length="{ length }"
                              >
                                {{
                                  $t(
                                    "create_appeal.dropdowns.services_choise",
                                    length
                                  )
                                }}
                              </template>
                              <template v-slot:option-content="props">
                                <div
                                  :class="{
                                    'disabled-option':
                                      appealStore.checkSuggestedServices(
                                        props.option
                                      ) ||
                                      appealStore.cantRemoveFromSelectedServices(
                                        props.option
                                      ),
                                  }"
                                >
                                  <span>
                                    {{ props.option.name }}
                                  </span>
                                  <span class="price">
                                    -
                                    {{ formatPrice(props.option.pivot.price) }}
                                  </span>
                                  <span
                                    v-if="
                                      appealStore.checkSuggestedServices(
                                        props.option
                                      )
                                    "
                                  >
                                    (добавлено
                                    {{
                                      appealStore.isClinic
                                        ? "компанией"
                                        : "клиникой"
                                    }})
                                  </span>
                                  <span
                                    v-if="
                                      appealStore.cantRemoveFromSelectedServices(
                                        props.option
                                      )
                                    "
                                  >
                                    {{
                                      appealStore.isAgent
                                        ? " (завершено клиникой)"
                                        : " (решение компании)"
                                    }}
                                  </span>
                                </div>
                                <CheckIcon
                                  v-if="
                                    appealStore.checkSelectedServices(
                                      props.option
                                    ) &&
                                    !appealStore.cantRemoveFromSelectedServices(
                                      props.option
                                    )
                                  "
                                />
                              </template>
                              <template v-slot:action>
                                <SimpleInput
                                  class="dropdown-space"
                                  placeholder="введите стоимость услуги"
                                  @update:model-value="handleServiceCustomPrice"
                                  :model-value="
                                    serviceCustomPrice.formattedValue
                                  "
                                  number
                                />
                                <SimpleButton
                                  type="button"
                                  label="добавить сервис"
                                  customClass="btn-action"
                                  @click="addCustomService"
                                  :disabled="disabledServiceButton"
                                  full-width
                                ></SimpleButton>
                              </template>
                            </DropdownSelectNew>
                          </div>
                          <div class="tab-body">
                            <SelectListItem
                              v-for="service in appealStore.selectedServices"
                              :item="service"
                              :removable="true"
                              :key="service.id"
                              :commonStatus="clientData.appealStatus"
                              :isAgent="appealStore.isAgent"
                              @update:status="
                                (item) => handleStatusService(item, false)
                              "
                              @update:progress="
                                (item) => handleStatusService(item, false)
                              "
                              @update:quantity="
                                (item) => handleStatusService(item, false)
                              "
                              @remove:item="(item) => handleRemoveService(item)"
                            >
                              <template #label>
                                {{ service.name }}
                              </template>
                              <template #price>
                                {{ formatPrice(Number(service.pivot.price)) }}
                              </template>
                            </SelectListItem>

                            <div
                              class=""
                              v-if="appealStore.suggestedServices.length > 0"
                            >
                              <p
                                class="added-by-title"
                                v-if="!appealStore.isClinic"
                              >
                                Добавлено клиникой
                              </p>
                              <p class="added-by-title" v-else>
                                Добавлено компанией
                              </p>
                              <SelectListItem
                                v-for="service in appealStore.suggestedServices"
                                :item="service"
                                :removable="false"
                                :key="service.id"
                                :isAgent="appealStore.isAgent"
                                :commonStatus="clientData.appealStatus"
                                @update:status="
                                  (item) => handleStatusService(item, true)
                                "
                                @update:progress="
                                  (item) => handleStatusService(item, true)
                                "
                                @update:quantity="
                                  (item) => handleStatusService(item, true)
                                "
                              >
                                <template #label>
                                  {{ service.name }}
                                </template>
                                <template #price>
                                  {{ formatPrice(Number(service.pivot.price)) }}
                                </template>
                              </SelectListItem>
                            </div>
                          </div>
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
                      :disabled="!appealStore.selectedClinic"
                      :loading="appealStore.loading"
                      @click="handleCreateAppeal"
                    >
                      <template #loading-spinner>
                        <LoadingSpinner />
                      </template>
                      <template #tooltip v-if="!appealStore.selectedClinic">
                        <q-tooltip
                          :delay="100"
                          max-width="300px"
                          self="bottom middle"
                          :offset="[0, -50]"
                          class="custom-tooltip"
                          transition-show="scale"
                          transition-duration="200"
                        >
                          Клиника не выбрана
                        </q-tooltip>
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
                    <div
                      class="create-appeal-done-action"
                      v-if="appealStore.isAgent"
                    >
                      <SimpleCheckbox
                        @change="handleAppealDoneCheckbox"
                        :checked="
                          appealStore.finishedAppeal ||
                          clientData.appealStatus === 2
                        "
                        :disabled="
                          appealStore.finishedAppeal ||
                          clientData.appealStatus === 2 ||
                          checkSuggestedItems
                        "
                      >
                      </SimpleCheckbox>
                      <span>Сделать завершенным</span>
                    </div>
                  </div>
                  <div
                    class="create-appeal-action-expences"
                    v-if="!appealStore.isClinic"
                  >
                    <span class="create-appeal-action-expences-title"
                      >Общий расход:
                    </span>

                    <span class="create-appeal-action-expences-total">{{
                      formatPrice(appealStore.appealTotalConsumption)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="create-appeal-right">
              <div class="create-appeal-interaction">
                <div class="tabs-container tabs-container-gap">
                  <div class="tabs-header">
                    <q-tabs dense active-class="tab-active" v-model="tabRight">
                      <q-tab
                        name="chat"
                        label="Чат"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                      <q-tab
                        name="history"
                        label="История"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                    </q-tabs>
                  </div>
                  <div class="tabs-content appeal-content">
                    <keep-alive>
                      <q-tab-panels
                        v-model="tabRight"
                        animated
                        swipeable
                        transition-next="jump-right"
                        transition-prev="jump-left"
                      >
                        <q-tab-panel
                          name="chat"
                          key="chat"
                          :disable="appealStore.typeOfAppeal === 0"
                        >
                          <AppealChat
                            v-if="appealStore.typeOfAppeal === 1"
                            :appealId="clientData.appealId"
                            :appealType="appealStore.typeOfAppeal"
                          />
                        </q-tab-panel>
                        <q-tab-panel
                          name="history"
                          key="history"
                          :disable="appealStore.typeOfAppeal === 0"
                        >
                          <AppealHistory :appealId="clientData.appealId" />
                        </q-tab-panel>
                      </q-tab-panels>
                    </keep-alive>
                  </div>
                </div>
              </div>
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
import { onMounted, ref, reactive, computed, watch } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useAppealStore } from "src/stores/appealStore.js";
import { useAuthStore } from "src/stores/authStore";
import { useAppealsHistory } from "src/composables/useAppealsHistory";
import formatPrice from "src/helpers/formatPrice";
import Trans from "src/i18n/translation";
import SimpleCheckbox from "src/components/Shared/SimpleCheckbox.vue";
import StatusBar from "src/components/Shared/StatusBar.vue";
import DropdownSelectNew from "src/components/Shared/DropdownSelectNew.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import TextAreaInput from "src/components/Shared/TextAreaInput.vue";
import DateInput from "src/components/Shared/DateInput.vue";
import SelectListItem from "src/components/Shared/SelectListItem.vue";
import CheckIcon from "src/components/Shared/CheckIcon.vue";
import LoadingSpinner from "src/components/Shared/LoadingSpinner.vue";
import AppealChat from "src/components/AppealChat.vue";
import AppealHistory from "src/components/AppealHistory.vue";
import TableTooltip from "src/components/Shared/TableTooltip.vue";

const $q = useQuasar();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const appealStore = useAppealStore();

const { dataArray, addData } = useAppealsHistory();

const { client: clientData } = storeToRefs(appealStore);
const createAppealModalFixed = ref(true);
const router = useRouter();
const route = useRoute();

const tab = ref("clinics");
const tabRight = ref("chat");
const createAppealModalRef = ref(null);

const doctorDropdownRef = ref(null);
const doctorCustomPrice = reactive({
  rawValue: "",
  formattedValue: "",
});
const disabledDoctorButton = computed(
  () => doctorCustomPrice.rawValue.length === 0
);

const checkSuggestedItems = computed(() => {
  return (
    appealStore.suggestedDoctors.length > 0 ||
    appealStore.suggestedServices.length > 0
  );
});

const serviceDropdownRef = ref(null);
const serviceCustomPrice = reactive({
  rawValue: "",
  formattedValue: "",
});
const disabledServiceButton = computed(
  () => serviceCustomPrice.rawValue.length === 0
);

const handleRemoveDoctor = (doctor) => {
  appealStore.removeDoctor(doctor);
};
const handleRemoveService = (service) => {
  appealStore.removeService(service);
};

const handleCreateAppeal = async () => {
  const result = await appealStore.postAppealData();

  appealStore.setTypeOfAppeal("CHANGE");

  $q.loading.show({
    delay: 500,
  });

  await appealStore.fetchMedicalPrograms();
  await appealStore.fetchApplicantData(appealStore.client.appealId);
  await appealStore.fetchHospitalData();

  $q.loading.hide();
  const { dmsCode, appealId, clientFirstname, clientLastname } =
    appealStore.client;

  addData({
    dmsCode,
    appealId,
    clientFirstname,
    clientLastname,
    appealType: "CLINIC",
  });

  if (appealStore.isAgent) {
    router.replace(
      Trans.i18nRoute({
        name: "createAppealLimit",
        params: { id: appealStore.client.appealId },
      })
    );
  }
};

const handleChangeAppeal = async () => {
  await appealStore.changeAppealData();

  if (appealStore.isAgent) {
    const appealStatuses = appealStore.allDoctorsStatus.concat(
      appealStore.allServicesStatus
    );

    const programItemIdIsZero = appealStatuses.some(
      (pivot) => pivot.program_item_id === 0 && pivot.status !== 2
    );

    if (programItemIdIsZero) {
      await appealStore.fetchMedicalPrograms();
      await appealStore.fetchApplicantData(appealStore.client.appealId);
      await appealStore.fetchHospitalData();

      router.replace(
        Trans.i18nRoute({
          name: "createAppealLimit",
          params: { id: appealStore.client.appealId },
        })
      );
    } else {
      hideModal();
    }
  }
};

const appealDoneCheckbox = ref(false);
const handleAppealDoneCheckbox = () => {
  appealDoneCheckbox.value = !appealDoneCheckbox.value;
  appealStore.makeAppealDone(appealDoneCheckbox.value);
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

onMounted(() => {
  // console.log(`client`, clientData.value);

  console.log($q);
});

const hideModal = () => {
  appealStore.clearAppealData();
  appealStore.clearClinicData();
  appealStore.setClient(null);

  if (appealStore.isClinic) {
    router.replace(Trans.i18nRoute({ name: "appeals-page" }));
  } else {
    router.go(-1);
  }
  createAppealModalRef.value.hide();
};

const handleDoctorCustomPrice = (value) => {
  doctorCustomPrice.rawValue = value;
  doctorCustomPrice.formattedValue = value.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " "
  );
};

const addCustomDoctor = () => {
  const doctor = {
    name: doctorDropdownRef.value.searchValue,
    id: null,
    pivot: {
      price: doctorCustomPrice.rawValue,
    },
  };

  doctorCustomPrice.rawValue = "";
  doctorCustomPrice.formattedValue = "";
  appealStore.selectDoctors(doctor);
  doctorDropdownRef.value.closeModal();
};

const handleServiceCustomPrice = (value) => {
  serviceCustomPrice.rawValue = value;
  serviceCustomPrice.formattedValue = value.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    " "
  );
};
const addCustomService = () => {
  const service = {
    name: serviceDropdownRef.value.searchValue,
    id: null,
    pivot: {
      price: serviceCustomPrice.rawValue,
    },
  };

  serviceCustomPrice.rawValue = "";
  serviceCustomPrice.formattedValue = "";
  appealStore.selectServices(service);
  serviceDropdownRef.value.closeModal();
};

const handleStatusDoctor = (item, isSuggested) => {
  appealStore.changeStatusDoctor(item, isSuggested);
};
const handleStatusService = (item, isSuggested) => {
  appealStore.changeStatusService(item, isSuggested);
};

const setComment = (val) => {
  if (appealStore.isClinic) {
    return;
  }

  appealStore.setComment(val);
};

// const handleRemoveDrug = (item) => {
//   appealStore.clearDrugs(item);
// };
// const handleAddDrug = () => {
//   appealStore.setDrugs(drugData);
// };
</script>

<style lang="scss" scoped>
.create-appeal-modal .modal-container {
  width: 90%;
  padding: 0;
  position: relative;
  overflow: visible;
}
.create-appeal-modal .modal-header {
  // border-top-left-radius: 16px;
  // padding: 24px;
  &-top {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 12px;
    margin-bottom: 16px;
  }
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
  column-gap: 16px;
}
.create-appeal-left {
  display: flex;
  flex-direction: column;
  flex-basis: 65%;
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
  row-gap: 8px;
  flex-wrap: wrap;
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
  border-radius: 24px;
  padding: 24px;
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

  &-gap {
    row-gap: 24px;
  }
}
.q-tab {
  height: 44px;
  flex: 1;
}
.q-tab-panel {
  //  overflow: hidden;
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
.create-appeal-right {
  flex-basis: 35%;
}
.create-appeal-interaction {
  background-color: #fff;
  height: 100%;
  border-radius: 24px;
  padding: 24px;
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

.temp-text {
  height: calc(100vh - 252px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  color: hsla(221, 27%, 34%, 0.158);
  user-select: none;
}
.create-appeal-done-action {
  margin-left: 16px;
  span {
    font-size: 15px;
    font-weight: 500;
  }
  display: flex;
  align-items: center;
  column-gap: 8px;
}

:global(.create-appeal-form .q-tab__content) {
  flex-direction: row;
  column-gap: 8px;
}
.appeal-count-badge {
  background-color: $accent;
  color: #fff;
  padding: 2px 5px;
  font-weight: 500;

  &--negative {
    background-color: $negative;
  }
}
</style>
