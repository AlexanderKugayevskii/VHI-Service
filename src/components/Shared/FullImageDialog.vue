<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" class="full-image">
    <div class="modal-body">
      <img :src="imageSrc" alt="Full Image" class="dialog-image" />
    </div>
    <div class="create-appeal-close">
      <button class="create-appeal-close-btn" @click="onDialogHide">
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
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M1 1L11 11"
              stroke="#fff"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </q-icon>
      </button>
    </div>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from "quasar";
import SimpleButton from "../Shared/SimpleButton.vue";

const props = defineProps({
  imageSrc: {
    type: String,
  },
});
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogOK, onDialogHide } = useDialogPluginComponent();

const hideModal = () => {
  onDialogHide();
};
</script>

<style lang="scss" scoped>
.modal-body {
  display: flex;
  justify-content: center;
  max-width: 768px;
}
.dialog-image {
  max-width: 100%;
  height: auto;
  object-fit: cover;
}

.create-appeal-close {
  position: absolute;
  right: 32px;
  top: 32px;
  z-index: 100;
  &-btn {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    background: none;
    border: none;
    outline: none;
    cursor: pointer;
  }
}

:global(.full-image .q-dialog__backdrop) {
  background: rgba(64, 79, 111, 0.9);
}
</style>
