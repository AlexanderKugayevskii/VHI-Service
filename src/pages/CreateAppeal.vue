<template>
  <q-dialog
    full-height
    maximized
    no-backdrop-dismiss
    ref="createAppealModalRef"
    class="create-appeal-modal"
  >
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="page-title q-my-none">Обращение</h4>
          <AppealStatus></AppealStatus>
        </div>
        <div class="create-appeal-body">
          <div class="create-appeal-row">
            <div class="create-appeal-left">
              <div class="create-appeal-client-info">
                <div class="create-appeal-client-text">
                  <span>ID: 1/22/001/220</span>
                  <span>Клиент: Ходжаев Сергей</span>
                  <span>Программа: DMS Ultra</span>
                  <span>Родственник: Эргашев Фаррух</span>
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
                        label="Клиника и диагноз"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                      <q-tab
                        name="doctors"
                        label="Врачи"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                      <q-tab
                        name="services"
                        label="Сервисы"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                      <q-tab
                        name="drugstore"
                        label="Аптека"
                        :ripple="false"
                        class="tab--no-hover"
                      />
                    </q-tabs>
                  </div>
                  <div class="tabs-content">
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="clinics">
                        <div class="tab-header">
                          <DropdownSelect
                            label="Клиника"
                            placeholder="Выберете клинику"
                            class="appeal-dropdown"
                          ></DropdownSelect>
                          <SimpleInput
                            label="Диагноз"
                            placeholder="Введите диагноз"
                          ></SimpleInput>
                        </div>
                      </q-tab-panel>

                      <q-tab-panel name="doctors">
                        <div class="tab-header">
                          <DropdownSelect
                            placeholder="Выберете врача"
                          ></DropdownSelect>
                        </div>
                      </q-tab-panel>

                      <q-tab-panel name="services">
                        <div class="tab-header">
                          <DropdownSelect
                            placeholder="Выберете сервисы"
                          ></DropdownSelect>
                        </div>
                      </q-tab-panel>
                      <q-tab-panel name="drugstore">
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

                <div class="create-appeal-actions">
                  <div class="create-appeal-actions-btns">
                    <SimpleButton
                      label="Создать обращение"
                      type="submit"
                      customClass="btn-action"
                    ></SimpleButton>
                    <SimpleButton
                      label="Выйти"
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
          <button class="create-appeal-close-btn">
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
import AppealStatus from "src/components/ClientsTable/AppealStatus.vue";
import DropdownSelect from "src/components/Shared/DropdownSelect.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import { ref } from "vue";

const tab = ref("clinics");
const createAppealModalRef = ref(null);
const hideModal = () => {
  createAppealModalRef.value.hide();
};
</script>

<style lang="scss" scoped>
.q-dialog__inner > .modal-container {
  width: 90%;
  background-color: #edf0f5;
  border-radius: 20px;
  padding: 0;
}
.modal-header {
  display: block;
}
.modal-content {
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
</style>
