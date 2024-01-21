<template>
  <div class="flex status-row">
    <div
      class="status-left"
      :class="{
        'status-done': status === 'В работе' || status === 'Завершено',
      }"
    ></div>
    <div
      class="status-right"
      :class="{ 'status-done': status === 'Завершено' }"
    ></div>
  </div>
  <div class = "status-outer-text"> 
    <span class="status-text">{{ status }}</span>
  </div>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    default: () => {
      return "Новое";
    },
  },
});
</script>

<style lang="scss" scope>
.status-row {
  column-gap: 1px;
  height: 8px;
  background-color: #edf0f5;
  border-radius: 50px;
  margin-bottom: 4px;
}
.status-left {
  flex: 1;
  border-radius: 50px 0 0 50px;

}
.status-right {
  flex: 1;
  border-radius: 0 50px 50px 0;

}
.status-done {
  background-color: #13b8ba;
}
.status-text {
  font-size: 11px;
  color: #404F6F;
}
</style>
