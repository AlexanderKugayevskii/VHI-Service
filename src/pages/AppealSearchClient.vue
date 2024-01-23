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
                  :show-icon="true"
                ></SimpleInput>
              </div>
              <div class="client-results">
                <div class="client-results__item">
                  <div class="client-results__item-check">
                    <SimpleCheckbox></SimpleCheckbox>
                  </div>
                  <div class="client-result-item-content">
                    <div class="client-result-item-info">
                      <span class="client-result-item-info-title"
                        >Серия и номер паспорта
                      </span>
                      <span class="client-result-item-info-descr"
                        >AB 72013013</span
                      >
                    </div>
                    <div class="client-result-item-info">
                      <span class="client-result-item-info-title"
                        >Серия и номер паспорта
                      </span>
                      <span class="client-result-item-info-descr"
                        >AB 72013013</span
                      >
                    </div>
                    <div class="client-result-item-info">
                      <span class="client-result-item-info-title"
                        >Серия и номер паспорта
                      </span>
                      <span class="client-result-item-info-descr"
                        >AB 72013013</span
                      >
                    </div>
                    <div class="client-result-item-info">
                      <span class="client-result-item-info-title"
                        >Серия и номер паспорта
                      </span>
                      <span class="client-result-item-info-descr"
                        >AB 72013013</span
                      >
                    </div>
                  </div>
                  <div class="client-result-item-tag">
                    <div class="client-result-item-tag-text">Клиент</div>
                  </div>
                </div>
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
          custom-class="btn-action"
        ></SimpleButton>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import SimpleInput from "src/components/Shared/SimpleInput.vue";
import SimpleCheckbox from "src/components/Shared/SimpleCheckbox.vue";
import { ref } from "vue";

const tab = ref("byId");

const appealSearchClientRef = ref(null);
const hideModal = () => {
  appealSearchClientRef.value.hide();
};
</script>

<style lang="scss" scoped>
.appeal-search-container {
  min-width: 600px;
}
.tab-header {
  margin-bottom: 20px;
}

.client-results__item {
  display: flex;
  align-items: center;
  column-gap: 16px;
  padding: 12px;
  background-color: #f7f9fc;
  border-radius: 16px;
}
.client-results__item-check {
}
.client-result-item-content {
  flex-grow: 1;
}
.client-result-item-tag {
  align-self: flex-start;
}
.client-result-item-info {
  display: flex;
  column-gap: 4px;
  font-size: 15px;
  margin-bottom: 8px;
}
.client-result-item-info-title {
  color: #7a88a6;
}
.client-result-item-info-descr {
  color: #404f6f;
  font-weight: 500;
}

.client-result-item-tag-text {
  background-color: #e0fafb;
  color: #1a8c8d;
  font-size: 15px;
  border-radius: 8px;
  padding: 4px 8px;
}
</style>
