<template>
  <q-page class="flex body-bg">
    <div class="col page-container">
      <DetailInfoGroup />
    </div>
  </q-page>
</template>

<script setup>
import DetailInfoGroup from "src/components/ClientInfo/DetailInfoGroup.vue";
import LoadingSpinner from "src/components/Shared/LoadingSpinner.vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useFullClientTableStore } from "src/stores/allClientTableStore";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const $q = useQuasar();
const i18n = useI18n();
const allClientTableStore = useFullClientTableStore();

onMounted(async () => {
  $q.loading.show({
    delay: 500,
  });
  await allClientTableStore.getClientInfo(props.id);
  $q.loading.hide();
});
</script>
<style lang="scss" scoped></style>
