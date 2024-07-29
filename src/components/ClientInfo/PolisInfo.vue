<template>
  <div class="polis-info">
    <div class="polis-info__left">
      <div>
        <p>
          <span>ID:</span>
          <span>{{ data.dmsCode }}</span>
        </p>
        <p v-if="data.programName">
          <span>Программа:</span>
          <span>{{ data.programName }}</span>
        </p>
      </div>
      <div class="polis-info__dates">
        <p>
          <span>Дата начала страхования:</span>
          <span>{{ data.startDate }}</span>
        </p>
        <p>
          <span>Дата конца страхования:</span>
          <span>{{ data.endDate }}</span>
        </p>
      </div>
      <div class="polis-info__company">
        <p>
          <span>Номер контракта:</span>
          <span>{{ data.contractNumber }}</span>
        </p>
        <p>
          <span>Заявитель:</span>
          <span>{{ data.applicant }}</span>
        </p>
      </div>
    </div>
    <div class="polis-info__right" v-if="hasMedicalPrograms">
      <div class="polis-info__remainder">
        <span>Общий остаток</span>
        <span>{{
          formatPrice(parseFloat(clientInfo.program?.liability) - data.remaind)
        }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFullClientTableStore } from "src/stores/allClientTableStore";
import formatPrice from "src/helpers/formatPrice";
import { onMounted } from "vue";

const allClientTableStore = useFullClientTableStore();
const clientInfo = computed(() => allClientTableStore.clientInfo);
const medicalPrograms = computed(() => allClientTableStore.medicalLimits);

const hasMedicalPrograms = computed(() =>
  medicalPrograms.value.every((p) => p.name !== null)
);

const data = computed(() => {
  return {
    dmsCode: clientInfo.value?.dms_code,
    programName: clientInfo.value?.program?.name,
    liability: formatPrice(parseFloat(clientInfo.value.program?.liability)),
    remaind: medicalPrograms.value.reduce((acc, curr) => {
      return acc + parseFloat(curr.spent);
    }, 0),
    startDate: clientInfo.value.contract.start_date,
    endDate: clientInfo.value.contract.end_date,
    contractNumber: clientInfo.value.contract.contract_number,
    applicant: clientInfo.value.contract.applicant,
  };
});

onMounted(() => {
  console.log(clientInfo.value);
});
</script>

<style lang="scss" scoped>
.polis-info {
  background-color: #fff;
  border-radius: 50px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 20px;
  color: #404f6f;
  font-size: 15px;

  &__left {
    display: flex;
    column-gap: 20px;

    div {
      flex-basis: 25%;
    }
    div p {
      margin-bottom: 8px;
    }
  }

  &__dates {
    white-space: nowrap;
  }
  &__company {
    flex-grow: 1;
  }
  &__right {
    white-space: nowrap;
  }
  .polis-info__remainder {
    background-color: #cff7f8;
    padding: 4px 12px;
    border-radius: 50px;
  }
  p {
    margin: 0;
  }
  p,
  .polis-info__remainder {
    display: flex;
    align-items: center;
    column-gap: 4px;
  }
  span + span {
    font-weight: 500;
  }
}
</style>
