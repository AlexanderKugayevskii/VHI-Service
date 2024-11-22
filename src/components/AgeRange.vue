<template>
  <div>
    <div class="label">Возраст</div>
    <div class="reports">
      <SimpleInput label="От" placeholder="20" v-model="startAge" number />
      <SimpleInput label="До" placeholder="20" v-model="endAge" number />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import SimpleInput from "./Shared/SimpleInput.vue";

const { t } = useI18n();
const props = defineProps({
  disabledRule: {
    type: Boolean,
  },
});
const emit = defineEmits(["getRange", "getData"]);

const startAge = ref("");
const endAge = ref("");

watch([startAge, endAge], ([newStartAge, newEndAge]) => {
  if (newStartAge.length > 0 && newEndAge.length > 0) {
    emit("getRange", {
      min_age: startAge.value,
      max_age: endAge.value,
    });
  }
});
</script>

<style scoped lang="scss">
.reports {
  display: flex;
  align-items: flex-end;
  column-gap: 8px;
}
.label {
  color: #404f6f;
  font-size: 15px;
  line-height: 20px;
  margin-bottom: 8px;
}
</style>
