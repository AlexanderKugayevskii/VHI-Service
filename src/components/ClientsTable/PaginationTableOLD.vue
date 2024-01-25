<template>
  <div class="flex">
    <div class="pagination">
      <!-- prev -->
      <button type="button" :disabled="hasFirstPage" @click="decrement">
        &lt;
        <span>Предыдущая</span>
      </button>

      <!-- pages -->
      <!-- <button
        type="button"
        v-for="pageNum in paginationRange"
        :key="pageNum"
        @click="selectPage(pageNum)"
      >
        {{ pageNum }}
      </button> -->

      <!-- next -->
      <button type="button" :disabled="!hasNextPage" @click="increment">
        <span>Следующая</span>
        &gt;
      </button>

      <!-- <router-link
        id="page-prev"
        :to="{ name: 'appeals-page', query: { page: page - 1 } }"
        rel="prev"
        v-if="page != 1"
        >&#60; Previous</router-link
      >

      <div
        class="pagination-pages"
        :class="{ center: !hasNextPage || page == 1 }"
      >
        <router-link
          v-for="pageNum in paginationRange"
          :key="pageNum"
          :to="{ name: 'appeals-page', query: { page: pageNum } }"
          :class="{ active: pageNum === page }"
          >{{ pageNum }}</router-link
        >
      </div>

      <router-link
        id="page-next"
        :to="{ name: 'appeals-page', query: { page: page + 1 } }"
        rel="next"
        v-if="hasNextPage"
        >Next &#62;</router-link
      > -->
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref, toRefs, toRef } from "vue";
import { useClientsStore } from "src/stores/clientsStore";
const emit = defineEmits(['changePage'])
const props = defineProps(["pagination"]);
const clientStore = useClientsStore();

const { page } = toRefs(props.pagination);


const totalPages = computed(() => {
  return Math.ceil(clientStore.clients.items / props.pagination.rowsPerPage);
});

const hasFirstPage = computed(() => {
  return page.value === 1;
});
const hasNextPage = computed(() => {
  return page.value < totalPages.value;
});

const increment = () => {
  emit('changePage', page.value++);
}
const decrement = () => {
  emit('changePage', page.value--); 
}

const paginationRange = computed(() => {
  const sidePages = 2;
  const range = [];
  const start = Math.max(1, page.value - sidePages);
  const end = Math.min(page.value + sidePages, totalPages.value);

  // if (start > 1) {
  //   range.push(1);
  //   // if (start > 2) {
  //   //   range.push("..."); // Многоточие после первой страницы
  //   // }
  // }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  // if (end < totalPages.value) {
  //   // if (end < totalPages.value - 1) {
  //   //   range.push("..."); // Многоточие перед последней страницей
  //   // }
  //   range.push(totalPages.value);
  // }

  return range;
});
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 290px;
}
.pagination-pages {
  display: flex;
  column-gap: 10px;
}
.pagination-pages.center {
  flex: 1;
  justify-content: center;
}
.pagination a {
  text-decoration: none;
  color: #2c3e50;
}
.pagination a.active {
  font-weight: bold;
  text-decoration: underline;
}
#page-prev {
  text-align: left;
}
#page-next {
  text-align: right;
}
</style>
