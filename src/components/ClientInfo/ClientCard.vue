<template>
  <div class="client__card">
    <div class="client__card-info">
      <div class="client__card-text">
        <p>
          <span>Клиент: </span>
          <span>{{ clientData.clientName }}, {{ clientData.birthDay }}</span>
        </p>
        <p>
          <span>Паспорт: </span>
          <span>{{ clientData.passport }}</span>
        </p>
        <p v-if="clientData.phone">
          <span>Телефон: </span>
          <span>{{ clientData.phone }}</span>
        </p>
      </div>
      <!-- <div class="client__card-extra">
        <h6 class="client__card-extra-title">Расходы</h6>
        <div class="client__card-extra-text">
          <p>
            <span>Аптека: </span>
            <span class="text-negative">-69 000 UZS</span>
          </p>
          <p>
            <span>Клиника: </span>
            <span>0 UZS</span>
          </p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import formatNumber from "src/helpers/formatNumber";
const props = defineProps({
  client: {
    type: Object,
  },
});

const client = computed(() => props.client);
const clientData = computed(() => {
  return {
    clientName: client.value?.lastname + " " + client.value?.name,
    birthDay: client.value?.birthday.slice(0, 4),
    passport: client.value?.seria + " " + client.value?.number,
    phone: client.value?.phone ? formatNumber(client.value?.phone) : null,
  };
});
</script>

<style lang="scss" scoped>
.client__card {
  background-color: #fff;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  border-radius: 24px;

  &-info {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
  }

  &-text {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    p {
      margin: 0;
      display: flex;
      column-gap: 4px;
      font-size: 15px;
      line-height: 20px;

      span + span {
        font-weight: 500;
      }
    }
  }

  &-extra {
    display: flex;
    flex-direction: column;
    row-gap: 8px;

    &-text {
      display: flex;
      flex-direction: column;
      row-gap: 8px;
      p {
        margin: 0;
        display: flex;
        column-gap: 4px;
        font-size: 15px;
        line-height: 20px;

        span + span {
          font-weight: 500;
        }
      }
    }

    &-title {
      margin: 0;
      font-size: 15px;
      color: #7a88a6;
      line-height: 20px;
      font-weight: 500;
    }
  }
}
</style>
