<template>
  <div class="client__card">
    <div class="client__card-info">
      <div class="client__card-text">
        <p>
          <span>Клиент: </span>
          <span>Ходжаев Сергей, 1998</span>
        </p>
        <p>
          <span>Паспорт: </span>
          <span>AA 1234567</span>
        </p>
        <p>
          <span>Телефон: </span>
          <span>+998 (90) 123 20 27</span>
        </p>
      </div>
      <div class="client__card-extra">
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
      </div>
    </div>
  </div>
</template>

<script setup></script>

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
