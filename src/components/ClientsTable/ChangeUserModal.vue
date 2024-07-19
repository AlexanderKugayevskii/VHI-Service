<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss>
    <div class="modal-container appeal-search-container">
      <div class="modal-header">
        <h4 class="page-title q-my-none">Изменить данные клиента</h4>
      </div>
      <div class="modal-body">
        <div class="modal-row">
          <DropdownSelectNew
            label="Резидент"
            class="dropdown-space"
            :multiple="false"
            :options="residentsTypes"
            :selected-options="selectedResidentType"
            @select-option="selectResidentType"
          >
            <template #top-label>Резидент</template>
            <template #placeholder> Выберите тип </template>
            <template v-slot:selected-options-once="props">
              <div>{{ props.option.name }}</div>
            </template>
            <template v-slot:option-content="props">
              <div>{{ props.option.name }}</div>
              <CheckIcon v-if="checkSelectedResident(props.option)" />
            </template>
          </DropdownSelectNew>
        </div>
        <div class="modal-row">
          <SimpleInput
            maxlength="14"
            label="ПИНФЛ"
            placeholder="00000000000000"
            @update:model-value="changeUserPinfl"
            :model-value="userPinfl"
            number
          />
        </div>
        <div class="modal-row">
          <PhoneInput
            placeholder="+998 99 123-45-67"
            label="Телефон"
            @update:model-value="changeUserPhone"
            :model-value="userPhone"
          />
        </div>
      </div>
      <div class="modal-footer">
        <SimpleButton
          :label="$t('appeal_search.cancel')"
          custom-class="btn-cancel"
          @click="hideModal"
        />
        <SimpleButton
          label="Изменить данные"
          :custom-class="['btn-action']"
          @click="changeUserData"
        >
        </SimpleButton>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDialogPluginComponent } from "quasar";
import useResidentTypes from "../../composables/useResidentTypes";
import { ref, computed, onMounted, watchEffect } from "vue";
import ClientService from "src/services/ClientService";
import SimpleCheckbox from "../Shared/SimpleCheckbox.vue";
import SimpleButton from "../Shared/SimpleButton.vue";
import SimpleInput from "../Shared/SimpleInput.vue";
import PhoneInput from "../Shared/PhoneInput.vue";
import DropdownSelectNew from "../Shared/DropdownSelectNew.vue";
import CheckIcon from "../Shared/CheckIcon.vue";
const props = defineProps({
  user: {
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const $q = useQuasar();
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();


const residentsTypes = useResidentTypes();
const selectedResidentTypeId = ref(props.user.residentType ?? null);

const selectedResidentType = computed(() => {
  return residentsTypes.value.find(
    (resident) => resident.id === selectedResidentTypeId.value
  );
});

const userPinfl = ref(props.user.pinfl);
const userPhone = ref(props.user.phone);

const changeUserPinfl = (value) => {
  userPinfl.value = value;
};
const changeUserPhone = (value) => {
  userPhone.value = value;
};

const selectResidentType = (resident) => {
  if (selectedResidentTypeId.value === resident.id) {
    selectedResidentTypeId.value = null;
  } else {
    selectedResidentTypeId.value = resident.id;
  }
};

const checkSelectedResident = (resident) => {
  return resident.id === selectedResidentTypeId.value;
};

const changeUserData = async () => {
  try {
    const data = await ClientService.updateClientData(props.user.clientId, {
      pinfl: userPinfl.value,
      phone: userPhone.value,
      residentType: selectedResidentTypeId.value,
    });

    $q.notify({
      type: "success",
      message: "Данные успешно изменены",
      position: "bottom",
    });
    onDialogOK();
  } catch (e) {
    console.error(e);
  }
};

const hideModal = () => {
  onDialogHide();
};
</script>

<style lang="scss" scoped>
.appeal-search-container {
  min-width: 600px;
}
.tab-header {
  margin-bottom: 20px;
}
.modal-row {
  display: flex;
  align-items: center;
  column-gap: 4px;
  margin-bottom: 16px;
}
</style>
