<template>
  <q-page class="flex column body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Акт и ЭСФ</h2>

      <div class="fields-result">
        <div class="fields-result-group q-mb-lg">
          <h3 class="page-title q-my-none q-mb-md">Сервисы</h3>

          <ServiceTableShow :id="id" @getDataFromTable="getDataFromTable" />
        </div>
        <!-- <div v-else>
          <h3 class="page-title text-center">Сервисы не найдены</h3>
        </div> -->
        <div class="fields-result-group q-mb-lg">
          <!-- v-if="fieldsData.doctors.length > 0" -->
          <h3 class="page-title q-my-none q-mb-md">Врачи</h3>

          <DoctorsTableShow :id="id" @getDataFromTable="getDataFromTable" />
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
            v-if="isClinic"
            type="button"
            customClass="appeals-btn"
            label="Отправить акт"
            :loading="loadingSendAct"
            @click="downloadAct"
          >
            <template #loading-spinner>
              <LoadingSpinner />
            </template>
          </SimpleButton>

          <SimpleButton
            v-if="isAgent"
            type="button"
            customClass="appeals-btn"
            label="Подтвердить акт"
            @click="confirmAct"
          >
          </SimpleButton>
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
import LoadingSpinner from "src/components/Shared/LoadingSpinner.vue";
import { useAuthStore } from "src/stores/authStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

const props = defineProps({
  id: String,
});

const { appContext } = getCurrentInstance();
const vueEimzo = appContext.config.globalProperties.$eimzo;
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const isClinic = computed(() => user.value.role.id === 8);
const isAgent = computed(() => user.value.role.id !== 8);
//eimzo data
const eimzoKey = ref(null);
const didoxAuth = ref(false);
const loadingSendAct = ref(false);

const dataFields = ref(null);

onMounted(async () => {
  console.log(user.value);
});

const getDataFromTable = (data) => {
  dataFields.value = data;
};

const getTimeStamp = async (hex, fun, fail) => {
  console.log(`hex`, hex);
  await didox
    .post("v1/dsvs/gettimestamp", {
      signatureHex: hex,
    })
    .then(async (res) => {
      await fun(res.data.timeStampTokenB64);
    })
    .catch(async (e) => {
      await fail(e);
    });
};

// получить ключ eimzo
const getEimzoKey = async () => {
  await vueEimzo.install();
  const certs = await vueEimzo.listAllUserKeys();
  console.log(certs);
  const certForTest = certs[1];

  if (isClinic.value) {
    // eimzoKey.value = certs.find((cert) => cert.TIN === user.value.hospital.INN);
    eimzoKey.value = certForTest;
  }
};

//Получить токен от дидокса и сохранить в storage
const getDidoxToken = async () => {
  if (!didoxAuth.value) {
    await getEimzoKey();
    let check;
    if (eimzoKey.value) {
      console.log(`eimzoVAlue`, eimzoKey.value);
      let loadKey = await vueEimzo.loadKey(eimzoKey.value);
      let tin = eimzoKey.value.TIN;
      try {
        console.log(loadKey.id);
        console.log(tin);
        const result = await vueEimzo.createPkcs7(
          loadKey.id,
          tin,
          getTimeStamp
        );
        check = 1;

        if (check === 1) {
          try {
            const response = await didox.post("v1/auth/" + tin + "/token", {
              signature: result,
            });
            const token = response.data.token;
            localStorage.setItem("token_didox", token);
            didoxAuth.value = true;
          } catch (e) {
            didoxAuth.value = false;
            console.error(e);
          }
        }
      } catch (e) {
        check = 0;
        console.error(e);
      }
    } else {
      console.error("У вас нет ключа E-imzo");
      return;
    }
  }
};

//подписать акт
const signDidox = async (res) => {
  await getEimzoKey();
  let loadKey = await vueEimzo.loadKey(eimzoKey.value);
  let check;

  try {
    const signatureResponse = await vueEimzo.createPkcs7(
      loadKey.id,
      JSON.stringify(res.data.pending_document.document_json),
      getTimeStamp
    );
    check = 1;

    try {
      const signResponse = await didox.post(
        "v1/documents/" + res.data._id + "/sign",
        {
          signature: signatureResponse,
        }
      );
      console.log(signResponse);
    } catch (e) {
      console.error("не удалось подписать документ");
    }
  } catch (e) {
    console.error("неверный пароль");
    check = 0;
  }
};

// отправить акт
const sendAct = async (base64File) => {
  loadingSendAct.value = true;
  try {
    const response = await didox.get("v1/profile");
    const seller = response.data;

    const data = {
      data: {
        isValid: true,
        Buyer: {
          Name: '"NEO INSURANCE CORP" AJ',
          BranchCode: "",
          BranchName: "",
          VatRegCode: "303010223700",
          Account: "20216000605651575001",
          BankId: "00401",
          Address: "Hamid Sulaymon MFY, Mirobod ko'chasi, 9-a-uy ",
          Director: "SHIRINOV JA'FAR ESANBAYEVICH",
          Accountant: "MAMATKULOVA ZULFIYA SHUKURULLAYEVNA",
          VatRegStatus: 20,
        },
        didoxorderid: "",
        Document: {
          DocumentNo: `${dataFields.value.id}`,
          DocumentDate: `${dataFields.value.date}`, //date of esf,
          DocumentName: "AKT",
        },
        ContractDoc: {
          ContractNo: user.value.contract_nomer,
          ContractDate: user.value.contract_date,
        },
        Seller: seller,
        SellerTin: eimzoKey.value.TIN,
        BuyerTin: "310491216",
      },
      document: "data:application/pdf;base64," + base64File,
    };

    try {
      const createDocumentResponse = await didox.post(
        "v1/documents/000/create",
        data
      );
      // после успешной отправки нужно подписать документ
      await signDidox(createDocumentResponse);

      const status = await ActService.aktSent(props.id);
      console.log(`act-status`, status);
      $q.notify({
        type: "success",
        message: "Документ успешно отправлен в DIDOX",
        position: "center",
      });
    } catch (e) {
      console.error(e);
      console.error("Не удалось отправить файл в DIDOX");
    }
  } catch (e) {
    console.error(e);
  } finally {
    loadingSendAct.value = false;
  }
};

//download act
const fileLoad = ref(false);
const fileError = ref("");
const downloadAct = async () => {
  try {
    const response = await ActService.getPdfAct(props.id);
    const blob = new Blob([response.data], { type: "application/pdf" });
    const base64File = await blobToBase64(blob);

    await getEimzoKey();
    await getDidoxToken();
    await sendAct(base64File);
  } finally {
    fileLoad.value = false;
  }
};

const confirmAct = async () => {
  try {
    const status = await ActService.aktSent(props.id);
    console.log(`status by agent`, status);
  } catch (e) {
    console.error(e);
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
