<template>
  <LoadingSpinner v-if="allClientTableStore.loading" />
  <div class="details" v-else>
    <h2 class="page-title q-my-none">Информация полиса</h2>
    <PolisInfo />
    <div class="details-main">
      <DetailCard v-for="item in mainPrograms" :key="item.id" :rate="item" />
    </div>
    <ExpandBtn
      :text="`Показать еще (${extraPrograms.length})`"
      @btn-click="handleShowDetailsExtra"
      v-if="!showDetailsExtra && extraPrograms.length > 0"
      :expand="showDetailsExtra"
    />
    <div class="details-extra" v-show="showDetailsExtra">
      <DetailCard
        class="details-extra-card"
        v-for="item in extraPrograms"
        :key="item.id"
        :rate="item"
      />
    </div>
    <ExpandBtn
      v-if="showDetailsExtra"
      @btn-click="handleShowDetailsExtra"
      :expand="showDetailsExtra"
    />
    <div class="details-clients">
      <ClientCard :client="client" />
      <ClientCard
        v-for="client in subClients"
        :key="client.id"
        :client="client"
      />
    </div>
    <div class="details-tabs">
      <p class="details-tabs__title">Обращения</p>
      <div class="details-tabs__items">
        <ClientTab :isSelected="true" :client="client" />
        <ClientTab
          v-for="client in subClients"
          :key="client.id"
          :client="client"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LoadingSpinner from "../Shared/LoadingSpinner.vue";
import ExpandBtn from "src/components/ClientInfo/ExpandBtn.vue";
import PolisInfo from "src/components/ClientInfo/PolisInfo.vue";
import DetailCard from "src/components/ClientInfo/DetailCard.vue";
import ClientCard from "src/components/ClientInfo/ClientCard.vue";
import ClientTab from "src/components/ClientInfo/ClientTab.vue";
import { useFullClientTableStore } from "src/stores/allClientTableStore";
import { storeToRefs } from "pinia";
import formatPrice from "src/helpers/formatPrice";
import { computed } from "vue";
const showDetailsExtra = ref(false);
const handleShowDetailsExtra = () => {
  showDetailsExtra.value = !showDetailsExtra.value;
};

const allClientTableStore = useFullClientTableStore();
const clientInfo = computed(() => allClientTableStore.clientInfo);
const program = computed(() => {
  return clientInfo.value.program.medical_program_items;
});
const mainPrograms = computed(() => {
  return program.value?.slice(0, 2);
});
const extraPrograms = computed(() => {
  return program.value?.slice(2);
});
const client = computed(() => {
  return clientInfo.value?.client;
});
const subClients = computed(() => clientInfo.value?.sub_clients);
</script>

<style lang="scss" scoped>
.details {
  display: flex;
  flex-direction: column;
  row-gap: 16px;

  &-main {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  &-extra {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;

    &-card {
      flex-basis: calc(25% - (16px / 4 * 3));
    }
  }

  &-clients {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  &-tabs {
    display: flex;
    align-items: center;
    column-gap: 8px;
    &__title {
      margin: 0;
      color: #2c3955;
      font-size: 23px;
      font-weight: 700;
      line-height: 28px;
    }
    &__items {
      display: flex;
      align-items: center;
      column-gap: 12px;
    }
  }
}

.v-collapse {
  transition: opacity 300ms cubic-bezier(0.33, 1, 0.68, 1);
}
</style>
