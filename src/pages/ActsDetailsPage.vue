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
import { onBeforeMount, ref, getCurrentInstance, computed } from "vue";
import { didox } from "src/boot/eimzo";
import blobToBase64 from "src/helpers/blobToBase64";
import formatPrice from "src/helpers/formatPrice.js";
import ActService from "src/services/ActService.js";
import AppealService from "src/services/AppealService.js";
import ServiceTableShow from "src/components/ActsTable/ServiceTableShow.vue";
import DoctorsTableShow from "src/components/ActsTable/DoctorsTableShow.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import { useAuthStore } from "src/stores/authStore";
import { storeToRefs } from "pinia";

import { onMounted } from "vue";
import { forAliasRE } from "@vue/compiler-core";
const props = defineProps({
  id: String,
});

const { appContext } = getCurrentInstance();
const vueEimzo = appContext.config.globalProperties.$eimzo;
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const isClinic = computed(() => user.value.role.id === 8);
//eimzo data
const eimzoKey = ref(null);

onMounted(async () => {
  await getEimzoKey();
  await getDidoxToken();
});

const getEimzoKey = async () => {
  await vueEimzo.install();
  const certs = await vueEimzo.listAllUserKeys();
  const certForTest = certs[0];
  if (isClinic.value) {
    // eimzoKey.value = certs.find((cert) => cert.TIN === user.value.hospital.INN);
    eimzoKey.value = certForTest;
  }
};

const getDidoxToken = async () => {
  await getEimzoKey();
  let ckeck;
  if (eimzoKey.value) {
    let loadKey = await vueEimzo.loadKey(eimzoKey.value);
    let text = eimzoKey.value.TIN;
    let check = 1;

    const result = await vueEimzo
      .createPkcs7(loadKey.id, text, getTimeStamp)
      .catch((e) => {
        check = 0;
      });

    console.log(result);
  }
};

const getTimeStamp = async (hex, fun, fail) => {
  await didox
    .post("v1/dsvs/gettimestamp", {
      signatureHex: hex,
    })
    .then(async (res) => {
      console.log(res);
      await fun(res.data.timestampTokenB64);
    })
    .catch(async (e) => {
      await fail(e);
    });
};

//download act
const fileLoad = ref(false);
const fileError = ref("");
const downloadAct = async () => {
  try {
    const response = await ActService.getPdfAct(props.id);
    const blob = new Blob([response.data], { type: response.data.type });
    const base64File = await blobToBase64(blob);
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
