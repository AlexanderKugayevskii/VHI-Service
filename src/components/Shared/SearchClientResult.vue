<template>
  <div
    :class="[
      'client-results__item',
      {
        'client-results__item--gap': item.type_id === 1,
      },
      {
        'client-results__item--last': item.type_id === 1 && item.last,
      },
      {
        'client-results__item--margin': item.hasSubClient,
      },
    ]"
    @click="selectItem"
  >
    <div class="client-results__item-check">
      <SimpleCheckbox
        :item="item"
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
          item.passportSeria + " " + item.passportNumber
        }}</span>
      </div>
      <div class="client-result-item-info" v-if = "item.type_id === 0">
        <span class="client-result-item-info-title">ID </span>
        <span class="client-result-item-info-descr">{{ item.dmsCode }}</span>
      </div>
      <div class="client-result-item-info">
        <span class="client-result-item-info-title">Фамилия и Имя </span>
        <span class="client-result-item-info-descr">{{
          item.clientLastname + " " + item.clientFirstname
        }}</span>
      </div>
      <div class="client-result-item-info" v-if = "item.type_id === 0">
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

const selectItem = () => {
  emit("update:selectValue", props.item);
};
// const handleCheckboxChange = (item) => {};
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
  cursor: pointer;
}
.client-results__item--margin {
  margin-bottom: 8px;
}
.client-results__item--gap {
  margin-bottom: 8px;
  margin-left: 24px;
  box-shadow: -4px 0 0 0 rgba(19, 183, 186, 0.247);
}
.client-results__item--last {
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
