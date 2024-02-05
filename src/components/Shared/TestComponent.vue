<template>
  <div class="dropdown">
    <button @click="toggleDropdown">Выбрать элементы</button>
    <div v-if="isOpen" class="dropdown-menu">
      <input type="text" v-model="search" placeholder="Поиск..." />
      <div
        class="dropdown-item"
        v-for="item in filteredItems"
        :key="item.id"
        @click="selectItem(item)"
      >
        <input type="checkbox" :checked="isSelected(item)" @click.stop />
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const isOpen = ref(false);
    const items = ref([
      { id: 1, name: "Пункт 1" },
      { id: 2, name: "Пункт 2" },
    ]); // Пример списка элементов
    const selectedItems = ref([]);
    const search = ref("");

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const filteredItems = computed(() => {
      return items.value.filter((item) =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    const selectItem = (item) => {
      if (selectedItems.value.includes(item)) {
        selectedItems.value = selectedItems.value.filter(
          (selectedItem) => selectedItem !== item
        );
      } else {
        selectedItems.value.push(item);
      }
    };

    const isSelected = (item) => {
      return selectedItems.value.includes(item);
    };

    // Для закрытия дропдауна при клике вне компонента, реализуйте соответствующую логику здесь

    return {
      isOpen,
      toggleDropdown,
      search,
      filteredItems,
      selectItem,
      isSelected,
    };
  },
};
</script>

<style>
/* Добавьте стили для вашего компонента здесь */
.dropdown-menu {
  position: absolute;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 100%;
}
.dropdown-item {
  padding: 10px;
  cursor: pointer;
}
.dropdown-item:hover {
  background-color: #f0f0f0;
}
</style>
