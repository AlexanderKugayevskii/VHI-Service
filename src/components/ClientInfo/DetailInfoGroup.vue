<template>
  <LoadingSpinner v-if="allClientTableStore.loading" />
  <div class="details" v-else>
    <div class="details-header">
      <h2 class="page-title q-my-none">Информация полиса</h2>
      <SimpleButton
        label="Скачать отчет"
        :customClass="[
          'appeals-btn',
          { 'appeals-btn_negative': fileError.length },
        ]"
        @click="getExcelData"
      />
    </div>
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
    <!-- v-if="allClientTableStore.clientInfo.applications.length > 0" -->
    <AppealsTable
      :rows="allClientTableStore.applicationsRows"
      :columns="columnsWithoutClientName"
      :loading="allClientTableStore.loading"
      @createAppeal="openAppealTypeModal"
    />
  </div>
  <AppealType v-model:="appealTypeFixed" />
</template>

<script setup>
import { ref, computed } from "vue";
import LoadingSpinner from "../Shared/LoadingSpinner.vue";
import ExpandBtn from "src/components/ClientInfo/ExpandBtn.vue";
import PolisInfo from "src/components/ClientInfo/PolisInfo.vue";
import DetailCard from "src/components/ClientInfo/DetailCard.vue";
import ClientCard from "src/components/ClientInfo/ClientCard.vue";
import ClientTab from "src/components/ClientInfo/ClientTab.vue";
import { storeToRefs } from "pinia";
import { useFullClientTableStore } from "src/stores/allClientTableStore";
import { useClientTableStore } from "src/stores/clientTableStore";
import AppealsTable from "../ClientsTable/AppealsTable.vue";
import SimpleButton from "../Shared/SimpleButton.vue";
import ClientService from "src/services/ClientService";
import dayjs from "dayjs";
import AppealType from "src/pages/AppealType.vue";

const props = defineProps({
  contractClientId: {
    type: String,
    required: true,
  },
});
const showDetailsExtra = ref(false);
const handleShowDetailsExtra = () => {
  showDetailsExtra.value = !showDetailsExtra.value;
};

// clinic or drugdstore modal ref
const appealTypeFixed = ref(false);
const openAppealTypeModal = () => {
  appealTypeFixed.value = true;
};

const clientTableStore = useClientTableStore();
const { pagination, rows, columns, loading } = storeToRefs(clientTableStore);

const allClientTableStore = useFullClientTableStore();

const columnsWithoutClientName = computed(() => {
  return columns.value.filter((column) => column.name !== "client");
});

const clientInfo = computed(() => allClientTableStore.clientInfo);
const medicalLimits = computed(() => allClientTableStore.medicalLimits);
const program = computed(() => {
  return clientInfo.value.program.medical_program_items;
});
const mainPrograms = computed(() => {
  return medicalLimits.value?.slice(0, 2);
});
const extraPrograms = computed(() => {
  return medicalLimits.value?.slice(2);
});
const client = computed(() => {
  return clientInfo.value?.client;
});
const subClients = computed(() => clientInfo.value?.sub_clients);

const fileLoad = ref(false);
const fileError = ref("");
const getExcelData = async () => {
  fileLoad.value = true;
  fileError.value = "";
  try {
    const response = await ClientService.getClientExcelData(
      props.contractClientId
    );
    console.log(`infoclient`, response);
    const fileName = `${client.value.lastname}-${client.value.name}`;
    const fileDate = dayjs().format("D-MM-YY");

    const blob = new Blob([response.data], { type: response.data.type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}_${fileDate}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    fileError.value = `Ошибка при скачивании файла`;
  } finally {
    fileLoad.value = false;
  }
};
</script>

<style lang="scss" scoped>
.details {
  display: flex;
  flex-direction: column;
  row-gap: 16px;

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
