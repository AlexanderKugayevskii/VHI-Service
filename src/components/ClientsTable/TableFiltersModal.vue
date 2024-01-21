<script setup>
import {ref} from 'vue'

const filter = ref({
  clientName: '',
  appealDate: '',
  appealStatus: '',
  clinicName: '',
  doctorName: '',
  serviceName: '',

})

</script>

<template>
  <q-dialog>
    <q-card class="filter-container">
      <h4 class="page-title q-my-none q-mb-md">Фильтры</h4>

      <div class="filter-item">
        <p class="label-text">Клиент</p>
        <q-input
            rounded
            dense
            borderless
            class="search-input q-px-md q-py-xxs"
            v-model="filter.clientName"
            placeholder="Введите фамилию и имя клиента"
        />
      </div>
      <div class="filter-item">

      </div>
      <p class="label-text">Дата обращения</p>
      <q-input
          rounded
          dense
          borderless
          class="search-input q-px-md q-py-xxs"
          v-model="filter.appealDate" placeholder="01.01.1990"
          mask="##.##.####"/>

      <div class="filter-item">
        <p class="label-text">Статус</p>
        <q-select
            filled
            v-model="filter.appealStatus"
            use-input
            use-chips
            multiple
            input-debounce="300"
        />

      </div>

      <div class="filter-item">
        <p class="label-text">Клиника</p>
        <q-select
            filled
            v-model="filter.clinicName"
            use-input
            use-chips
            multiple
            input-debounce="300"
        />

      </div>
      <div class="filter-item">
        <p class="label-text">Врач</p>
        <q-select
            filled
            v-model="filter.doctorName"
            use-input
            use-chips
            multiple
            input-debounce="300"
        />

      </div>
      <div class="filter-item">
        <p class="label-text">Сервис</p>
        <q-select
            filled
            v-model="filter.serviceName"
            use-input
            use-chips
            multiple
            input-debounce="300"
        />

      </div>


      <div class="">
        <q-btn flat label="Decline" color="primary" v-close-popup/>
        <q-btn flat label="Accept" color="primary" v-close-popup/>
      </div>
    </q-card>
  </q-dialog>

</template>

<style scoped lang="scss">
.filter-container {
  width: 440px;
  padding: 20px 24px 20px 20px;
  border-radius: 24px;
}
.label-text{
  font-size: 15px;
  color: #404F6F;
  line-height: 20px;
  margin: 0 0 8px;
}
.filter-item{
  margin: 0 0 20px;
}
.search-input {
  background-color: #F2F5FA;
  border-radius: 50px;
  font-size: 15px;
  color: #7a88a6;
}
</style>