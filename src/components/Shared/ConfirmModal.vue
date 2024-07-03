<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss>
    <div class="modal-container appeal-search-container">
      <div class="modal-header">
        <h4 class="page-title q-my-none">{{ title }}</h4>
      </div>
      <div class="modal-body"></div>
      <div class="modal-footer">
        <SimpleButton
          label="Отмена"
          custom-class="btn-cancel"
          @click="hideModal"
        />
        <SimpleButton
          label="Удалить"
          :custom-class="['btn-action']"
          @click="confirmModal"
        >
        </SimpleButton>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import SimpleButton from "../Shared/SimpleButton.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
    default: "Подтвердить",
  },
});
defineEmits([...useDialogPluginComponent.emits, "confirm"]);

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const confirmModal = async () => {
  onDialogOK();
};

const hideModal = () => {
  onDialogHide();
};
</script>

<style scoped lang="scss"></style>
