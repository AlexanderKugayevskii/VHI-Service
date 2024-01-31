<template>
  <div class="dropdown">
    <label class="dropdown-label">
      <div class="dropdown-label-wrapper">
        <span class="dropdown-label-text">{{ label }}</span>
      </div>
      <div class="dropdown-button">
        <button class="dropdown-button-btn" @click="handleDropdown">
          <span
            class="dropdown-button-btn-text"
            v-if="!selectedOptions.length"
            >{{ placeholder }}</span
          >
          <span
            class="dropdown-button-btn-text-selected"
            v-else-if="selectedOptions.length === 1"
            >{{ selectedOptions.at(0)[tempId] }}</span
          >
          <span class="dropdown-button-btn-text-selected" v-else
            >Выбрано {{ selectedOptions.length }} приколов</span
          >
        </button>
        <q-icon size="20px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="#7A88A6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </q-icon>
      </div>
    </label>
    <Transition name="fade">
      <div key="dropdown-select" class="dropdown-select" v-if="showDropdown">
        <div class="dropdown-select-scroll">
          <div class="dropdown-select-search">
            <label class="dropdown-select-search-label">
              <input
                type="text"
                placeholder="Поиск"
                class="dropdown-select-search__field"
                @input="updateSearchValue($event.target.value)"
              />
              <q-icon size="20px">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M9.16683 15C12.3885 15 15.0002 12.3884 15.0002 9.16671C15.0002 5.94505 12.3885 3.33337 9.16683 3.33337C5.94517 3.33337 3.3335 5.94505 3.3335 9.16671C3.3335 12.3884 5.94517 15 9.16683 15Z"
                    stroke="#A0AABC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.6668 16.6667L13.3335 13.3334"
                    stroke="#A0AABC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </q-icon>
            </label>
          </div>

          <div class="dropdown-select-list" ref="dropdownListRef">
            <div
              v-for="option of searchItems"
              class="dropdown-select-list-item"
              :key="option[tempId]"
              @click="toggleOption(option)"
            >
              <div class="dropdown-select-list-item-text">
                <slot
                  name="option-content"
                  :option="option"
                  :checked="checkSelected(option)"
                >
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, computed } from "vue";
import debounce from "lodash/debounce";

const props = defineProps({
  label: String,
  placeholder: String,
  initialOptions: Array,
  multiple: {
    type: Boolean,
    default: true,
  },
  idKey: {
    type: String,
    default: "clientID",
  },
});

const emit = defineEmits(["update:selectedOptions"]);

const showDropdown = ref(false);
const dropdownListRef = ref(null); //for children elements
const searchValue = ref(""); //v model input

const selectedOptions = ref([]);

const updateSearchValue = debounce((newValue) => {
  searchValue.value = newValue;
}, 300);

//for temp id test
const tempId = computed(() => props.idKey);

const searchOptions = computed(() => {
  return props.initialOptions.filter((item) => {
    return item[tempId.value]
      .toLowerCase()
      .startsWith(searchValue.value.toLowerCase());
  });
});

const toggleOption = (option) => {
  if (props.multiple) {
    const index = selectedOptions.value.findIndex(
      (item) => item[tempId.value] === option[tempId.value]
    );
    if (index !== -1) {
      selectedOptions.value.splice(index, 1);
    } else {
      selectedOptions.value.push(option);
    }
  } else {
    selectedOptions.value[0] = option;
    showDropdown.value = false;
  }

  emit("update:selectedOptions", selectedOptions.value);
};

const checkSelected = (option) => {
  return selectedOptions.value.some(
    (item) => option[tempId.value] === item[tempId.value]
  );
};

const handleDropdown = () => {
  showDropdown.value = !showDropdown.value;
  if (!showDropdown.value) {
    searchValue.value = "";
  }
};

//watchers
//when dropdown is true => fetch Initial data and focus to input for search items
watch(showDropdown, async (newVal) => {
  if (newVal) {
    nextTick(() => {
      const input = document.querySelector(".dropdown-select-search__field");
      if (input) input.focus();
    });
  }
});

const searchItems = computed(() => {
  return searchOptions.value.length > 0
    ? searchOptions.value
    : props.initialOptions;
});

//change list height when searchItems value, dropdown is open, error is shown
watch([() => searchItems.value, showDropdown], async () => {
  await nextTick();
  if (!showDropdown.value) return;

  const dropdownSelectListItemElements = dropdownListRef.value.children ?? [];

  const totalHeight = Array.from(dropdownSelectListItemElements)
    .slice(0, 6)
    .reduce((acc, elem) => {
      const elemHeight = elem.getBoundingClientRect().height;
      return acc + elemHeight;
    }, 0);

  dropdownListRef.value.style.height = `${totalHeight}px`;
});
</script>

<style lang="scss" scoped>
.dropdown {
  width: 100%;
  position: relative;
}
.dropdown-select {
  position: absolute;
  top: calc(100% + 4px);
  width: 100%;
  z-index: 10;
  border-radius: 16px;
  padding: 0 4px 0 4px;
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px #cfd9ea;
}
.dropdown-select-scroll {
  padding: 0 4px 0 4px;
  overflow-y: scroll;
}
.dropdown-select-scroll::-webkit-scrollbar {
  width: 8px;
}
.dropdown-select-scroll::-webkit-scrollbar-track {
  border-radius: 50px;
  background-color: #f2f5fa;
  margin: 8px;
}
.dropdown-select-scroll::-webkit-scrollbar-thumb {
  border-radius: 50px;
  background-color: #e3e8f0;
}
.dropdown-label {
}
.dropdown-button {
  padding: 12px 16px;
  display: flex;
  background-color: #f2f5fa;
  border-radius: 16px;
}
.dropdown-button-btn {
  width: 100%;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  color: #7a88a6;
  padding: 0;
}

.dropdown-select-search {
  padding-left: 12px;
  padding-right: 12px;
  height: 40px;
  background-color: #fff;
  position: sticky;
  top: 0;
}
.dropdown-select-search-label {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f2f5fa;
}
.dropdown-select-search {
  &__field {
    width: 100%;
    border: none;
    background: none;
    outline: none;
    color: #404f6f;
    &::placeholder {
      color: #7a88a6;
    }
  }
}
.dropdown-select-list {
}
.dropdown-select-list-item {
  padding: 4px 0;
}
.dropdown-select-list-item-text {
  padding: 12px 12px;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  color: #404f6f;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: #edf0f7;
  }
  &--active {
    background-color: #edf0f7;
  }
}
.dropdown-label {
  cursor: pointer;
}
.dropdown-button-btn-text-selected {
  color: #404f6f;
}

.dropdown-select-error-message {
  font-size: 15px;
  padding: 12px 12px;
  color: $negative;
  column-gap: 8px;
}

.dropdown-label-wrapper {
  margin-bottom: 8px;
}
.dropdown-label-text {
  color: #404f6f;
  font-size: 15px;
  line-height: 20px;
}
</style>
