<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss>
    <div class="modal-container appeal-search-container">
      <div class="modal-header">
        <h4 class="page-title q-my-none">Изменить данные клиента</h4>
      </div>
      <div class="modal-body">
        <div class="modal-row">
          <span>Резидент: </span>
          <SimpleCheckbox
            :checked="isResident === 1"
            @change="changeResidentType"
            square
          />
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
import { ref } from "vue";
import ClientService from "src/services/ClientService";
import SimpleCheckbox from "../Shared/SimpleCheckbox.vue";
import SimpleButton from "../Shared/SimpleButton.vue";
import SimpleInput from "../Shared/SimpleInput.vue";
import PhoneInput from "../Shared/PhoneInput.vue";

const props = defineProps({
  user: {
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const $q = useQuasar();
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const userPinfl = ref(props.user.pinfl);
const userPhone = ref(props.user.phone);
const isResident = ref(props.user.residentType ?? 2);
const changeResidentType = () => {
  isResident.value = isResident.value === 2 ? 1 : 2;
};
const changeUserPinfl = (value) => {
  userPinfl.value = value;
};
const changeUserPhone = (value) => {
  console.log(value);
  userPhone.value = value;
};

const changeUserData = async () => {
  try {
    const data = await ClientService.updateClientData(props.user.clientId, {
      pinfl: userPinfl.value,
      phone: userPhone.value,
      residentType: isResident.value,
    });

    $q.notify({
      type: "success",
      message: "Данные успешно изменены",
      position: "bottom-left",
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
