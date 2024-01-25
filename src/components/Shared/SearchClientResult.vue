<template>
  <div class="client-results__item">
    <div class="client-results__item-check">
      <SimpleCheckbox
        :item="item"
        @change="handleCheckboxChange"
        name="search-client"
        :checked="checked"
      ></SimpleCheckbox>
    </div>
    <div class="client-result-item-content">
      <div class="client-result-item-info">
        <span class="client-result-item-info-title"
          >Серия и номер паспорта
        </span>
        <span class="client-result-item-info-descr">{{
          item.passportSeries
        }}</span>
      </div>
      <div class="client-result-item-info">
        <span class="client-result-item-info-title">ID </span>
        <span class="client-result-item-info-descr">{{ item.userID }}</span>
      </div>
      <div class="client-result-item-info">
        <span class="client-result-item-info-title">Фамилия и Имя </span>
        <span class="client-result-item-info-descr">{{ item.clientName }}</span>
      </div>
      <div class="client-result-item-info">
        <span class="client-result-item-info-title">Программа </span>
        <span class="client-result-item-info-descr">{{ item.program }}</span>
      </div>
    </div>
    <div class="client-result-item-tag">
      <div class="client-result-item-tag-text">{{ item.type }}</div>
    </div>
  </div>
</template>

<script setup>
import SimpleCheckbox from "./SimpleCheckbox.vue";

const props = defineProps({
  item: Object,
  checked: Boolean,
});

const emit = defineEmits(["update:selectValue"]);

const handleCheckboxChange = (item) => {
  emit("update:selectValue", item);
};
</script>

<style lang="scss" scoped>
.client-results__item {
  display: flex;
  align-items: center;
  column-gap: 16px;
  padding: 12px;
  background-color: #f7f9fc;
  border-radius: 16px;
  margin-bottom: 20px;
}
.client-results__item-check {
}
.client-result-item-content {
  flex-grow: 1;
}
.client-result-item-tag {
  align-self: flex-start;
}
.client-result-item-info {
  display: flex;
  column-gap: 4px;
  font-size: 15px;
  margin-bottom: 8px;
}
.client-result-item-info-title {
  color: #7a88a6;
}
.client-result-item-info-descr {
  color: #404f6f;
  font-weight: 500;
}

.client-result-item-tag-text {
  background-color: #e0fafb;
  color: #1a8c8d;
  font-size: 15px;
  border-radius: 8px;
  padding: 4px 8px;
}
</style>
