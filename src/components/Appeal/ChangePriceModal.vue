<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-backdrop-dismiss
    class="change-price-modal"
  >
    <div class="modal-container appeal-search-container">
      <div class="modal-header">
        <span class="title-label green">Изменить стомость</span>
        <h4 class="page-title q-my-none">
          {{ props.item.name }}
        </h4>
      </div>
      <div class="modal-body">
        <div class="modal-row">
          <SimpleInput
            class="dropdown-space"
            :placeholder="$t('create_appeal.dropdowns.enter_service_cost')"
            @update:model-value="handlePrice"
            :model-value="formattedValue"
            number
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
          :label="$t('create_appeal.buttons.change_data')"
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
import { ref, computed, onMounted, watchEffect, reactive } from "vue";
import ClientService from "src/services/ClientService";
import SimpleCheckbox from "../Shared/SimpleCheckbox.vue";
import SimpleButton from "../Shared/SimpleButton.vue";
import SimpleInput from "../Shared/SimpleInput.vue";
import PhoneInput from "../Shared/PhoneInput.vue";
import DropdownSelectNew from "../Shared/DropdownSelectNew.vue";
import CheckIcon from "../Shared/CheckIcon.vue";
const props = defineProps({
  item: {
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const $q = useQuasar();
const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const price = reactive({
  rawValue: props.item.pivot.price,
});

const formattedValue = computed(() =>
  String(price.rawValue).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
);
const handlePrice = (value) => {
  price.rawValue = value;
};

const changeUserData = async () => {
  onDialogOK({
    id: props.item.id,
    price: parseFloat(price.rawValue),
  });
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

.modal-header {
  flex-direction: column;
  align-items: start;
  row-gap: 8px;

  h4 {
    font-weight: 500;
  }
}
.modal-row {
  display: flex;
  align-items: center;
  column-gap: 4px;
  margin-bottom: 16px;
}
</style>
