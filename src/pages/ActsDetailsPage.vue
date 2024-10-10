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
          <div v-if="dataFields">
            <SimpleButton
              v-if="isClinic && dataFields.status === 1"
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
              v-if="isClinic && dataFields.status === 2"
              type="button"
              customClass="appeals-btn"
              label="Отправить счёт фактуру"
              :loading="loadingSendInvoice"
              @click="getFacturaData"
            >
              <template #loading-spinner>
                <LoadingSpinner />
              </template>
            </SimpleButton>
          </div>

          <div v-if="dataFields">
            <SimpleButton
              v-if="isAgent && dataFields.status === 0"
              type="button"
              customClass="appeals-btn"
              :label="isActConfirmed ? 'Подтверждено' : 'Подтвердить'"
              :disabled="isActConfirmed"
              @click="confirmAct"
            >
            </SimpleButton>
            <SimpleButton
              v-if="isAgent && dataFields.status === 1"
              type="button"
              customClass="appeals-btn"
              :label="isActSentConfirmed ? 'Акт подтвержен' : 'Подтвердить акт'"
              :disabled="isActSentConfirmed"
              @click="confirmActSent"
            >
            </SimpleButton>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import {
  onBeforeMount,
  ref,
  getCurrentInstance,
  computed,
  registerRuntimeCompiler,
} from "vue";
import { didox } from "src/boot/eimzo";
import axios from "axios";

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
import ProductClassModal from "src/components/ActsTable/ProductClassModal.vue";

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

onMounted(async () => {});

const getDataFromTable = (data) => {
  dataFields.value = data;
};

const getTimeStamp = async (hex, fun, fail) => {
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

  // const certForTest = certs[0];

  if (isClinic.value) {
    eimzoKey.value = certs.find((cert) => cert.TIN === user.value.hospital.INN);
    // eimzoKey.value = certForTest;
  }
};

//Получить токен от дидокса и сохранить в storage
const getDidoxToken = async () => {
  if (!didoxAuth.value) {
    await getEimzoKey();

    let check;
    if (eimzoKey.value) {
      let loadKey = await vueEimzo.loadKey(eimzoKey.value);
      let tin = eimzoKey.value.TIN;
      try {
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

            return `DIDOX_NOT_AUTH`;
          }
        }
      } catch (e) {
        check = 0;
        console.error(e);
        return `CANCEL_PASSWORD`;
      }
    } else {
      console.error("У вас нет ключа E-imzo");
      return `KEY_NOT_FOUND`;
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
      $q.notify({
        type: "success",
        message: "Акт выполненных работ успешно отправлен в DIDOX",
        position: "bottom",
      });
    } catch (e) {
      $q.notify({
        type: "error",
        message: "Акт выполненных работ не был отправлен",
        position: "bottom",
      });
      console.error(e);
      console.error("Не удалось отправить файл в DIDOX");
      return;
    }
  } catch (e) {
    console.error(e);
    return;
  } finally {
    loadingSendAct.value = false;
  }
};

const loadingSendInvoice = ref(false);
const sendInvoice = async (data, ikpuData) => {
  try {
    const responseSeller = await didox.get("v1/profile");

    // const responseIKPU =

    const seller = responseSeller.data;
    const sellerNew = {
      Name: seller.name ?? seller.company,
      BranchCode: "",
      BranchName: "",
      Account: seller.account,
      BankId: seller.bankCode,
      Address: seller.address,
      Director: seller.director,
      Accountant: seller.accountant,
      VatRegCode: seller.VATRegCode,
      VatRegStatus: seller.VATRegStatus,
    };

    const invoicePayload = {
      isValid: true,
      Version: 1,
      posTransaction: {
        terminalId: "",
        transactionId: "",
      },
      didoxcontractid: "",
      WaybillIds: [],
      HasMarking: false,
      reverse_calc: false,
      FacturaType: 0,
      FacturaDoc: {
        FacturaNo: data.id,
        FacturaDate: data.esf_date,
      },
      ContractDoc: {
        ContractNo: user.value.hospital.contract_ID,
        ContractDate: user.value.hospital.date_of_contract,
      },
      ContractId: "0",
      LotId: "",
      OldFacturaDoc: {
        OldFacturaDate: "",
        OldFacturaNo: "",
        OldFacturaId: "",
      },
      ItemReleasedDoc: {
        ItemReleasedFio: "",
      },
      FacturaInvestmentObjectDoc: {
        ObjectId: "",
        ObjectName: "",
      },
      FacturaEmpowermentDoc: {
        EmpowermentNo: "",
        EmpowermentDateOfIssue: "",
        AgentFio: "",
        AgentTin: "",
      },
      Expansion: {
        OrderNumber: "",
      },
      ForeignCompany: {
        CountryId: "",
        Name: "",
        Address: "",
        Bank: "",
        Account: "",
      },
      SellerTin: eimzoKey.value.PINFL,
      Seller: sellerNew,
      BuyerTin: "310491216",
      Buyer: {
        Name: '"NEO INSURANCE CORP" AJ',
        BranchCode: "",
        BranchName: "",
        VatRegCode: "303010223700",
        Account: "20216000605651575001",
        BankId: "00401",
        Address: "Hamid Sulaymon MFY, Mirobod ko'chasi, 9-a-uy",
        Director: "SHIRINOV JA'FAR ESANBAYEVICH",
        Accountant: "MAMATKULOVA ZULFIYA SHUKURULLAYEVNA",
        VatRegStatus: 20,
      },
      ProductList: {
        HasCommittent: false,
        HasLgota: sellerNew.VatRegStatus != 20 ? false : true,
        HasExcise: false,
        HasVat: false,
        Tin: eimzoKey.value.PINFL,
        Products: [
          {
            OrdNo: 1,
            id: "",
            LgotaId: sellerNew.VatRegStatus != 20 ? "" : 103282,
            CommittentName: "",
            CommittentTin: "",
            CommittentVatRegCode: "",
            CommittentVatRegStatus: "",
            Name: ikpuData.selectedIkpu.className,
            CatalogCode: ikpuData.selectedIkpu.classCode,
            CatalogName: ikpuData.selectedIkpu.className,
            Marks: "",
            Barcode: "",
            MeasureId: null,
            PackageCode: ikpuData.selectedPackage.code,
            PackageName: ikpuData.selectedPackage.name,
            Count: ikpuData.selectedIkpu.usePackage,
            Summa: dataFields.value.amount,
            DeliverySum: dataFields.value.amount,
            VatRate: 12,
            VatSum: 0,
            ExciseRate: 0,
            ExciseSum: 0,
            DeliverySumWithVat: dataFields.value.amount,
            WithoutVat: true,
            WithoutExcise: true,
            WarehouseId: null,
            Origin: 3,
          },
        ],
      },
    };

    try {
      const response = await didox.post(
        "v1/documents/002/create",
        invoicePayload
      );
      await signDidox(response);
      $q.notify({
        type: "success",
        message: "Счет-фактура успешно отправлена в DIDOX",
        position: "bottom",
      });
    } catch (e) {
      $q.notify({
        type: "error",
        message: "Ошибка при отправке счет фактуры",
        position: "bottom",
      });
    }
  } catch (e) {
    $q.notify({
      type: "error",
      message: "Ошибка при отправке счет фактуры",
      position: "bottom",
    });
    console.error(e);
  } finally {
    loadingSendInvoice.value = false;
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

    const result = await getDidoxToken();
    if (result === "KEY_NOT_FOUND") {
      $q.notify({
        type: "error",
        message: "У вас нет ключа E-imzo",
        position: "bottom",
      });
      return;
    }

    if (result === "DIDOX_NOT_AUTH") {
      $q.notify({
        type: "error",
        message: "Не удалось подключиться к DIDOX. Попробуйте еще раз",
        position: "bottom",
      });
      return;
    }

    if (result === "CANCEL_PASSWORD") {
      $q.notify({
        type: "error",
        message: "Неверный пароль или Вы нажали на кнопку 'Отмена'",
        position: "bottom",
      });
      return;
    }

    await sendAct(base64File);
  } catch (e) {
    console.error(e);
  } finally {
    fileLoad.value = false;
  }
};

const getFacturaData = async () => {
  try {
    loadingSendInvoice.value = true;

    const response = await ActService.getFactura(props.id);
    const data = response.data.data;

    await getEimzoKey();
    const result = await getDidoxToken();
    if (result === "KEY_NOT_FOUND") {
      $q.notify({
        type: "error",
        message: "У вас нет ключа E-imzo",
        position: "bottom",
      });
      return;
    }

    if (result === "DIDOX_NOT_AUTH") {
      $q.notify({
        type: "error",
        message: "Не удалось подключиться к DIDOX. Попробуйте еще раз",
        position: "bottom",
      });
      return;
    }

    if (result === "CANCEL_PASSWORD") {
      $q.notify({
        type: "error",
        message: "Неверный пароль или Вы нажали на кнопку 'Отмена'",
        position: "bottom",
      });
      return;
    }

    const responseVatProducts = await didox.get("v1/profile/productClasses/ru");
    const vatProductsData = responseVatProducts.data;

    $q.dialog({
      component: ProductClassModal,
      componentProps: {
        ikpuData: vatProductsData,
      },
    })
      .onOk(async (payload) => {
        await sendInvoice(data, payload);
      })
      .onCancel(() => {
        try {
          throw new Error("ikpu_cancel");
        } catch (err) {
          $q.notify({
            type: "error",
            message: "Выбор ИКПУ отменен. Попробуйте еще раз",
            position: "bottom",
          });

          return;
        }
      });
  } catch (e) {
    console.error(e);

    return;
  } finally {
  }
};

onMounted(async () => {
  // await getFacturaData();
});

const isActConfirmed = ref(false);
const confirmAct = async () => {
  try {
    const status = await ActService.aktUpdate(props.id);

    $q.notify({
      type: "success",
      message: "Акт успешно подтвержден",
      position: "bottom",
    });

    isActConfirmed.value = true;
  } catch (e) {
    console.error(e);
  }
};

const isActSentConfirmed = ref(false);
const confirmActSent = async () => {
  try {
    const status = await ActService.aktSent(props.id);
    isActSentConfirmed.value = true;
  } catch (e) {}
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
