<template>
  <q-page class="flex body-bg">
    <div class="col page-container">
      <DetailInfoGroup :contractClientId="id" />
    </div>
  </q-page>
</template>

<script setup>
import DetailInfoGroup from "src/components/ClientInfo/DetailInfoGroup.vue";
import LoadingSpinner from "src/components/Shared/LoadingSpinner.vue";
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { useFullClientTableStore } from "src/stores/allClientTableStore";
import { useAppealStore } from "src/stores/appealStore";
import { onBeforeMount } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const $q = useQuasar();
const i18n = useI18n();
// const previusRoute = ref(null);
// onBeforeRouteLeave((to, from, next) => {
//   // previusRoute.value = from;
//   console.log(from.fullPath);

//   $q.sessionStorage.set("previuos", from.fullPath);
//   next();
// });

const allClientTableStore = useFullClientTableStore();
onBeforeMount(() => {
  allClientTableStore.getClientInfo(props.id);
  allClientTableStore.fetchMedicalPrograms(props.id);
  allClientTableStore.fetchClinicApplications(props.id);
});
onMounted(() => {
  $q.loading.show({ delay: 20 });
  $q.loading.hide();
});
</script>
<style lang="scss" scoped></style>
