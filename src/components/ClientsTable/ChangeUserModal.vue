<template>
  <q-dialog ref="appealSearchClientRef" no-backdrop-dismiss>
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
          />
        </div>
        <div class="modal-row">
          <SimpleInput
            placeholder="ПИНФЛ"
            @update:model-value="changeUserPinfl"
            :model-value="userPinfl"
          />
        </div>
        <div class="modal-row">
          <SimpleInput
            placeholder="Телефон"
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
import ClientService from "src/services/ClientService";
import SimpleCheckbox from "../Shared/SimpleCheckbox.vue";
import SimpleButton from "../Shared/SimpleButton.vue";
import { ref } from "vue";
import SimpleInput from "../Shared/SimpleInput.vue";

const props = defineProps({
  user: {
    required: true,
  },
});

const appealSearchClientRef = ref(null);

const userPinfl = ref(props.user.pinfl);
const userPhone = ref(props.user.phone);
const isResident = ref(props.user.residentType);
const changeResidentType = () => {
  console.log(props.user);
  isResident.value = isResident.value === 2 ? 1 : 2;
};
const changeUserPinfl = (value) => {
  userPinfl.value = value;
};

const changeUserPhone = (value) => {
  userPhone.value = value;
};

const changeUserData = async () => {
  try {
    const data = await ClientService.updateClientData(props.user.clientId, {
      pinfl: userPinfl.value,
      phone: userPhone.value,
      residentType: isResident.value,
    });

    console.log(data);
  } catch (e) {
    console.error(e);
  }
};

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
.modal-row {
  display: flex;
  align-items: center;
  column-gap: 4px;
  margin-bottom: 16px;
}
</style>
