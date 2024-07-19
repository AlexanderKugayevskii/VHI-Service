<template>
  <div class="polis-info">
    <div class="polis-info__left">
      <p>
        <span>ID:</span>
        <span>{{ data.dmsCode }}</span>
      </p>
      <p v-if="data.programName">
        <span>Программа:</span>
        <span>{{ data.programName }}</span>
      </p>
    </div>
    <div class="polis-info__right" v-if="hasMedicalPrograms">
      <div class="polis-info__remainder">
        <span>Общий остаток</span>
        <span>{{ formatPrice(data.remaind) }}</span>
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
      return acc + (parseFloat(curr.limit) - parseFloat(curr.spent));
    }, 0),
  };
});

onMounted(() => {});
</script>

<style lang="scss" scoped>
.polis-info {
  background-color: #fff;
  border-radius: 50px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #404f6f;
  font-size: 15px;

  &__left {
    display: flex;
    column-gap: 10px;
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
