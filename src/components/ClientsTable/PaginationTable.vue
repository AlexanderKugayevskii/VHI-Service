<template>
  <div class="flex">
    <div class="pagination flex items-center">
      <!-- prev -->
      <button
        type="button"
        :disabled="hasPrevPage"
        @click="decrement"
        class="pagination-btn-control"
      >
        <q-icon size="20px">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.6667 15L6.66675 10L11.6667 5"
              stroke="#B8C2D1"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </q-icon>
        <span>{{ $t("pagination.prev") }}</span>
      </button>

      <button
        type="button"
        class="pagination-btn-num"
        :class="{
          'pagination-btn-num--active': pageNum === pagination.page,
          'pagination-btn-num--cursor-default': pageNum === '...',
        }"
        v-for="pageNum in paginationRange"
        :key="pageNum"
        @click="changePage(pageNum)"
      >
        {{ pageNum }}
      </button>
      <!-- next -->
      <button
        type="button"
        :disabled="hasNextPage"
        @click="increment"
        class="pagination-btn-control"
      >
        <span>{{ $t("pagination.next") }}</span>
        <q-icon size="20px"
          ><svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.33337 15L13.3334 10L8.33337 5"
              stroke="#7A88A6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </q-icon>
      </button>
    </div>
  </div>
</template>

<script setup>
import usePaginate from "src/composables/usePaginate";
import { toRef } from "vue";
const props = defineProps({
  pagination: {
    type: Object,
  },
});
const emit = defineEmits([
  "onIncrementPage",
  "onDecrementPage",
  "onChangePage",
]);

const pagination = toRef(() => props.pagination);

const { hasNextPage, hasPrevPage, paginationRange } = usePaginate(pagination);

const increment = () => {
  emit("onIncrementPage");
};
const decrement = () => {
  emit("onDecrementPage");
};
const changePage = (pageNum) => {
  emit("onChangePage", pageNum);
};
</script>

<style lang="scss" scoped>
button[type="button"] {
  border: none;
  font-size: 15px;
}
button[type="button"]:disabled {
  color: #a0aabc;
}
.pagination-btn-control {
  color: #404f6f;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  background: none;
  cursor: pointer;
}
.pagination-btn-num {
  cursor: pointer;
  border: none;
  background: none;
  padding: 4px 8px;
  border-radius: 8px;
  color: #404f6f;
  transition: 0.3s;
}
.pagination-btn-num--active {
  background: #e3e8f0;
}
.pagination-btn-num--cursor-default {
  cursor: default;
}
</style>
