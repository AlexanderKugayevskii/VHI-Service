<template>
  <q-page class="flex body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">TEST</h2>

      <!-- POLIS INFO -->
      <PolisInfo class="q-mb-md" />
      <!-- COMMON INFO -->

      <!-- DETAILS -->
      <div class="details">
        <DetailCard />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import PolisInfo from "src/components/ClientInfo/PolisInfo.vue";
import DetailCard from "src/components/ClientInfo/DetailCard.vue";
</script>

<style lang="scss" scoped>
.details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.details__card {
  background-color: #fff;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  row-gap: 12px;
  border-radius: 24px;

  &-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
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

  &-info {
    display: flex;
    justify-content: space-between;
  }
}
</style>
