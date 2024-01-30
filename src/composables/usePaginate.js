import { ref, computed } from "vue";

export default function usePaginate(pagination) {
  //pagination logic
  const totalPages = computed(() => {
    return Math.ceil(
      pagination.value.rowsNumber / pagination.value.rowsPerPage
    );
  });

  const hasNextPage = computed(
    () => totalPages.value === pagination.value.page
  );
  const hasPrevPage = computed(() => pagination.value.page === 1);
  const paginationRange = computed(() => {
    const sidePages = 1;
    const range = [];
    const start = Math.max(1, pagination.value.page - sidePages);
    const end = Math.min(pagination.value.page + sidePages, totalPages.value);

    if (start > 1) {
      range.push(1);
      if (start > 2) {
        range.push("..."); // Многоточие после первой страницы
      }
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (end < totalPages.value) {
      if (end < totalPages.value - 1) {
        range.push("..."); // Многоточие перед последней страницей
      }
      range.push(totalPages.value);
    }

    return range;
  });

  return { hasNextPage, hasPrevPage, paginationRange, totalPages };
}
