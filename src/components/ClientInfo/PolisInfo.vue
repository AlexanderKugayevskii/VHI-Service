<template>
  <div class="polis-info">
    <div class="polis-info__left">
      <p>
        <span>ID:</span>
        <span>1003/31/00999/32/000</span>
      </p>
      <p>
        <span>Программа:</span>
        <span>DMS ULTRA</span>
      </p>
    </div>
    <div class="polis-info__right">
      <div class="polis-info__remainder">
        <span>Общий остаток</span>
        <span>2 020 000 UZS</span>
      </div>
    </div>
  </div>
</template>

<script setup></script>

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
