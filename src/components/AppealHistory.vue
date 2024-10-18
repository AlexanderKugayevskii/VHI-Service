<template>
  <div>data</div>
</template>

<script setup>
import { ref, computed } from "vue";
import AppealService from "src/services/AppealService";

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
    console.log(response);
    if (response.status === "200") {
      const data = response.data;
      historyData.value = data;
    }
  } catch (e) {
  } finally {
    loading.value = false;
  }
};

getAppealHistory();
</script>
