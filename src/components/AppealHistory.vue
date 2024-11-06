<template>
  <div v-if="loading" class="history-loading">Загрузка...</div>
  <div v-else class="history-container">
    <AppealHistoryItem
      v-for="item in historyData"
      :key="item.id"
      :item="item"
    ></AppealHistoryItem>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import AppealService from "src/services/AppealService";
import AppealHistoryItem from "src/components/AppealHistoryItem.vue";

const props = defineProps({
  appealId: {
    required: true,
  },
});

const appealId = computed(() => props.appealId);
const loading = ref(false);
const historyData = ref(null);

const getAppealHistory = async () => {
  loading.value = true;

  try {
    const response = await AppealService.getHistoryAppeal(appealId.value);
    if (response.status === 200) {
      const data = response.data;
      historyData.value = data.data;
    }
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

getAppealHistory();
</script>

<style lang="scss" scoped>
.history-container {
  display: flex;
  flex-direction: column;
}
.history-loading {
  color: #404f6f;
}
</style>
