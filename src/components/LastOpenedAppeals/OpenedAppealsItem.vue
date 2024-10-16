<template>
  <div class="history-appeal-item" role="link" @click="openAppealPage">
    <div class="history-appeal-item-top">
      <span class="history-appeal-item-id">{{ item.appealId }}</span>
      <span :class="['title-label', `${labelType.className}`]">{{
        labelType.label
      }}</span>
    </div>
    <div class="history-appeal-item-middle">
      <span>{{ item.clientLastname }} {{ item.clientFirstname }} </span>
    </div>
    <div class="history-appeal-item-bottom">
      <span> {{ item.dmsCode }}</span>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useAppealStore } from "src/stores/appealStore";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Trans from "src/i18n/translation";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const $q = useQuasar();
const appealStore = useAppealStore();
const router = useRouter();

const labelType = computed(() => {
  if (props.item.appealType === "CLINIC") {
    return {
      className: "green",
      label: "Клиника",
    };
  } else if (props.item.appealType === "DRUGSTORE") {
    return {
      className: "red",
      label: "Аптека",
    };
  }
  return { className: "", label: "" };
});

const appealId = computed(() => props.item.appealId);

const openAppealPage = async () => {
  // appealStore.setClient(client);
  appealStore.setTypeOfAppeal("CHANGE");

  $q.loading.show({
    delay: 500,
  });

  await appealStore.fetchApplicantData(appealId.value);
  await appealStore.fetchHospitalData();

  $q.loading.hide();
  router.push(
    Trans.i18nRoute({
      name: "createAppeal",
      params: { id: appealId.value },
    })
  );
};
</script>

<style scoped lang="scss">
.history-appeal-item {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  padding: 8px 8px;
  transition: 0.3s;

  &:hover {
    border-radius: 12px;
    background-color: #e3e8f0;
  }

  &-top {
    display: flex;
    align-items: center;
    column-gap: 4px;
    margin-bottom: 4px;
  }
  &-id {
    font-weight: 700;
    display: inline-flex;
    padding: 4px 8px;
    background-color: #d0d8e581;
    border-radius: 8px;
    font-size: 15px;
  }
}
</style>
