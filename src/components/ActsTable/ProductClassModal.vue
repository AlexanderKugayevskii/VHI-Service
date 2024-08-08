<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" no-backdrop-dismiss>
    <div class="modal-container appeal-search-container">
      <div class="modal-header">
        <h4 class="page-title q-my-none">ИКПУ</h4>
      </div>
      <div class="modal-body">
        <div class="modal-row">
          <DropdownSelectNew
            :searchInput="false"
            label="ИКПУ и наименование товаров (работ, услуг)"
            :searchKey="'className'"
            class="dropdown-space"
            :multiple="false"
            :options="ikpuOptions"
            :selected-options="selectedIkpu"
            @select-option="selectIkpuOption"
          >
            <template #top-label
              >ИКПУ и наименование товаров (работ, услуг)</template
            >
            <template v-slot:selected-options-once="props">
              <div>
                {{ props.option.classCode }} - {{ props.option.className }}
              </div>
            </template>
            <template v-slot:option-content="props">
              <div>
                {{ props.option.classCode }} - {{ props.option.className }}
              </div>
            </template>
          </DropdownSelectNew>
        </div>
        <div class="modal-row" v-if="selectedIkpu">
          <DropdownSelectNew
            :searchInput="false"
            label="Ед. измерения"
            class="dropdown-space"
            :multiple="false"
            :options="selectedIkpu.packages"
            :selected-options="selectedPackage"
            @select-option="selectPackageOption"
          >
            <template #top-label>Ед. измерения</template>
            <template v-slot:selected-options-once="props">
              <div>{{ props.option.name }}<br />({{ props.option.code }})</div>
            </template>
            <template v-slot:option-content="props">
              <div>{{ props.option.name }}<br />({{ props.option.code }})</div>
            </template>
          </DropdownSelectNew>
        </div>
      </div>
      <div class="modal-footer">
        <SimpleButton
          :label="$t('appeal_search.cancel')"
          custom-class="btn-cancel"
          @click="hideModal"
        />
        <SimpleButton
          label="Принять"
          :custom-class="['btn-action']"
          @click="OK"
          :disabled="disableButton"
        >
        </SimpleButton>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDialogPluginComponent } from "quasar";
import { ref, computed } from "vue";
import SimpleButton from "../Shared/SimpleButton.vue";
import DropdownSelectNew from "../Shared/DropdownSelectNew.vue";
import CheckIcon from "../Shared/CheckIcon.vue";
const props = defineProps({
  ikpuData: {
    required: true,
  },
});

defineEmits([...useDialogPluginComponent.emits]);
const $q = useQuasar();
const { dialogRef, onDialogOK, onDialogHide, onDialogCancel } =
  useDialogPluginComponent();

const ikpuOptions = computed(() => {
  return props.ikpuData;
});

const selectedIkpu = ref(null);
const selectedPackage = ref(null);
const disableButton = computed(
  () => selectedIkpu.value === null || selectedPackage.value === null
);

const selectIkpuOption = (option) => {
  if (selectedIkpu.value?.classCode === option.classCode) {
    selectedIkpu.value = null;
  } else {
    selectedIkpu.value = option;
  }
};

const selectPackageOption = (option) => {
  if (selectedPackage.value?.code === option.code) {
    selectedPackage.value = null;
  } else {
    selectedPackage.value = option;
  }
};

const hideModal = () => {
  onDialogCancel();
};

const OK = () => {
  onDialogOK({
    selectedIkpu: selectedIkpu.value,
    selectedPackage: selectedPackage.value,
  });
};
</script>

<style lang="scss" scoped>
.appeal-search-container {
  min-width: 600px;
}
.modal-row {
  margin-bottom: 20px;
}
</style>
