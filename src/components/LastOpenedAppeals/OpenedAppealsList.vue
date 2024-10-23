<template>
  <div class="history-container">
    <div class="history-body">
      <OpenedAppealsItem
        v-for="item in reversedArray"
        :key="item.appealId"
        :item="item"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAppealsHistory } from "src/composables/useAppealsHistory";
import OpenedAppealsItem from "./OpenedAppealsItem.vue";
const { dataArray } = useAppealsHistory();

const reversedArray = computed(() => {
  return dataArray.value.toReversed();
});
</script>

<style scoped lang="scss"></style>
