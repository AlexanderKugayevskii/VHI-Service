<template>
  <q-page class="flex column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Акт и ЭСФ</h2>

      <div class="fields-result">
        <div class="fields-result-group q-mb-lg">
          <h3 class="page-title q-my-none q-mb-md">Сервисы</h3>

          <ServiceTableShow :id="id" />
        </div>
        <!-- <div v-else>
          <h3 class="page-title text-center">Сервисы не найдены</h3>
        </div> -->
        <div class="fields-result-group q-mb-lg">
          <!-- v-if="fieldsData.doctors.length > 0" -->
          <h3 class="page-title q-my-none q-mb-md">Врачи</h3>

          <DoctorsTableShow :id="id" />
        </div>
        <!-- <div v-else>
          <h3 class="page-title text-center">Врачи не найдены</h3>
        </div> -->
        <div class="fields-result-group--amount">
          <!-- v-if="fieldsData.services.length > 0 && fieldsData.doctors.length > 0" -->
          <!-- <p>Общая сумма: {{ formatPrice(parseFloat(fieldsData.amount)) }}</p> -->
        </div>
        <div class="fields-result-action flex flex-center">
          <!-- v-if="fieldsData.services.length > 0 && fieldsData.doctors.length > 0" -->
          <SimpleButton
            type="button"
            customClass="appeals-btn"
            label="Скачать акт (временно)"
            @click="downloadAct"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import formatPrice from "src/helpers/formatPrice.js";
import ActService from "src/services/ActService.js";
import AppealService from "src/services/AppealService.js";
import ServiceTableShow from "src/components/ActsTable/ServiceTableShow.vue";
import DoctorsTableShow from "src/components/ActsTable/DoctorsTableShow.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
const props = defineProps({
  id: String,
});


const fileLoad = ref(false);
const fileError = ref("");
const downloadAct = async () => {
  try {
    const response = await ActService.getPdfAct(props.id);

    // const fileName = row.drugstoreName;
    // const fileDate = dayjs().format("D-MM-YY");
    const blob = new Blob([response.data], { type: response.data.type });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `act.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (e) {
    console.error(e);
    fileError.value = `Ошибка при скачивании файла`;
  } finally {
    fileLoad.value = false;
  }
};
</script>

<style lang="scss" scoped>
.fields-result-group--amount {
  p {
    text-align: right;
    font-weight: 700;
    font-size: 24px;
  }
}
</style>
