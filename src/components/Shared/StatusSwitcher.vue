<template>
  <div :class="['status-row', dense && 'status-row-dense']">
    <div v-if="(isAgent && progress === 0)" class="status-item">
      Ожидает завершения
    </div>
   
    <div
      v-if="!isAgent && progress === 0"
      class="status-item clickable"
      @click="handleChangeProgress(1)"
    >
      Завершить
    </div>
    <div
      class="status-item status-done clickable"
      v-if="progress >= 1"
      @click="() => progress === 1 && handleChangeProgress(0)"
    >
      Завершено
    </div>
    <div class="status-item" v-if="!isAgent && !isSuperAdmin && progress === 1">Ожидание</div>
    <div
      class="status-item clickable"
      @click="() => (isAgent || isSuperAdmin) && handleChangeProgress(2)"
      v-if="(isAgent || isSuperAdmin) && progress === 1"
    >
      Подтвердить
    </div>
    <div
      class="status-item status-done"
      v-if="progress === 2"
      @click = "() => isSuperAdmin && handleChangeProgress(1)"
      >
      <!-- @click="() => isAgent && handleChangeProgress(1)" -->
      Подтверждено
    </div>
  </div>
</template>

<!-- 
    будет зависеть от "progess"
    1) клиника выбрала врача или сервис 
    2) агент нажимает галочку и появляется таблетка "ожидает завершения"
    3) клиника нажимает кнопку завершить и появляется таблетка с двумя типами (завершено | ожидает)
    4) агент нажимает на таблетку "подтвердить" и будет таблетка с двумя типами (завершено | подверждено)

    Ожидает подтверждения - агент role id !== 8   | progress === 0 
    Завершить - клиника - role id === 8  | progress === 1
    Завершено - клиника и агент progress == 1
    Ожидание - клиника role id === 8  | progress == 1
    Подтвердить - агент  role id !== 8  | progress == 2 

    <div>Подтверждено - клиника и агент</div>
-->
<script setup>
import { useAppealStore } from 'src/stores/appealStore';
import { computed } from 'vue';
const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  isAgent: {
    type: Boolean,
  },
  label: {
    type: Boolean,
    default: false,
  },
  dense: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:change"]);
const appealStore = useAppealStore()

const isSuperAdmin = computed(() => appealStore.isSuperAdmin)

const handleChangeProgress = (progress) => {
  emit("update:change", progress);
};
</script>

<style lang="scss" scoped>
.status-row {
  column-gap: 1px;
  height: 20px;
  background-color: #e3e8f0;
  border-radius: 50px;
  overflow: hidden;
  display: flex;
  width: 200px;
  margin-bottom: 0;
  &-dense {
    height: 8px;
  }
}

.status-item {
  flex-basis: 50%;
  font-size: 11px;
  font-weight: 400;
  color: #7a88a6;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  flex-grow: 1;
  transition: 0.3s;
}

.status-item {
  &.clickable {
    color: #404f6f;

    &:hover:not(.status-done) {
      cursor: pointer;
      background-color: #d0d8e5;
    }
  }
}
.status-done {
  color: #ecffff;
  background-color: #13b8ba;
  &.clickable {
    color: #fff;
    cursor: pointer;
  }
}
</style>
