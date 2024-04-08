<template>
  <q-page class="flex body-bg">
    <div class="col page-container">
      <h2 class="page-title q-my-none q-mb-md">Аптеки</h2>

      <div class="appeals-actions">
        <!-- <div class="appeals-filter">
            <div class="appeals-search-input">
              <q-input
                rounded
                dense
                borderless
                class="search-input q-px-sm"
                :placeholder="$t('search')"
                v-model="search"
                debounce="300"
              >
                <template v-slot:prepend>
                  <q-icon>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.16659 15C12.3882 15 14.9999 12.3883 14.9999 9.16665C14.9999 5.94499 12.3882 3.33331 9.16659 3.33331C5.94492 3.33331 3.33325 5.94499 3.33325 9.16665C3.33325 12.3883 5.94492 15 9.16659 15Z"
                        stroke="#B8C2D1"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.6666 16.6666L13.3333 13.3333"
                        stroke="#B8C2D1"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="appeals-badges">
              <q-btn
                dense
                round
                flat
                :ripple="false"
                class="filter-badge btn--no-hover"
                @click="modalFilterFixed = true"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.546 1.33331H3.45333C2.29466 1.33331 1.60333 2.61065 2.24666 3.56398L6.06133 8.55131C6.37933 9.02265 6.54866 9.57665 6.54866 10.1433V13.948C6.54866 14.5873 7.33066 14.9066 7.78866 14.4546L9.23999 13.0206C9.30726 12.9544 9.36069 12.8754 9.3972 12.7883C9.43371 12.7012 9.45256 12.6077 9.45266 12.5133V10.1433C9.45266 9.57665 9.62199 9.02331 9.93933 8.55131L13.7547 3.56398C14.3967 2.61065 13.7053 1.33331 12.546 1.33331Z"
                    fill="#404F6F"
                  />
                </svg>
                <q-badge floating v-if="filterOptions.length">{{
                  filterOptions.length
                }}</q-badge>
              </q-btn>
  
              <FilterChip
                v-for="option in expandedOptions"
                :key="option.label"
                :filterOption="option"
              />
              <div class="filter-chip-dropdown" v-if="extraOptions.length">
                <button
                  type="button"
                  class="filter-chip-dropdown-btn q-py-xs q-px-sm"
                  @click="toggleDropdown"
                >
                  +{{ extraOptions.length }}
                </button>
                <Transition name="fade">
                  <div
                    key="dropdown"
                    class="filter-chip-dropdown-content q-pa-sm"
                    v-show="showDropdown"
                  >
                    <FilterChip
                      v-for="option in extraOptions"
                      :key="option.label"
                      :filterOption="option"
                      hoverable
                    />
                  </div>
                </Transition>
              </div>
            </div>
          </div> -->

        <SimpleButton
          :label="$t('create_appeal.buttons.create_appeal')"
          type="button"
          customClass="appeals-btn"
          @click="searchFilterFixed = true"
        />
      </div>
      <DrugstoreTable />
    </div>

    <AppealSearchClient
      v-model:="searchFilterFixed"
      @openTypeModal="openAppealTypeModal"
    ></AppealSearchClient>
    <TableFiltersModal v-model:="modalFilterFixed"></TableFiltersModal>

    <AppealType
      v-model:="appealTypeFixed"
      @move-back="handleMoveBackToAppealSearch"
    />
    <router-view></router-view>
  </q-page>
</template>

<script setup>
import { reactive, computed, ref, onMounted } from "vue";
import DrugstoreTable from "src/components/ClientsTable/DrugstoreTable.vue";
import FilterChip from "src/components/Shared/FilterChip.vue";
import TableFiltersModal from "components/ClientsTable/TableFiltersModal.vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import AppealSearchClient from "./AppealSearchClient.vue";
import AppealType from "./AppealType.vue";

import CreateAppeal from "./CreateAppealPage.vue";
// const props = defineProps(["page", "perPage"])
// const page = computed(() => props.page);

const search = ref("");

const modalFilterFixed = ref(false);
const searchFilterFixed = ref(false);
const appealTypeFixed = ref(false);

const handleMoveBackToAppealSearch = (val) => {
  searchFilterFixed.value = val;
};
const openAppealTypeModal = (type) => {
  appealTypeFixed.value = type;
};

const filterOptions = reactive([
  {
    label: "Клиент",
    value: "Попова Алексей 444",
  },
  {
    label: "Дата обращения",
    value: "03.07.2023",
  },
  {
    label: "Статус",
    value: "В работе",
  },
  {
    label: "Клиника",
    value: "Название клиники",
  },
  {
    label: "Врач",
    value: "Григорий Чубик",
  },
  {
    label: "Сервис",
    value: "DMS",
  },
]);

const clientsData = computed(() => {
  return clientsStore.clients;
});

//filter badges
const expandedOptions = computed(() => {
  return filterOptions.slice(0, 2);
});
const extraOptions = computed(() => {
  return filterOptions.slice(2);
});

const showDropdown = ref(false);
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (e.target.closest(".filter-chip-dropdown")) {
      return;
    }
    showDropdown.value = false;
  });
});
</script>

<style lang="scss" scoped>
.search-input {
  background-color: #fff;
  border-radius: 50px;
  width: 250px;
  font-size: 15px;
  color: #7a88a6;
}
:global(.appeals-btn) {
  border-radius: 16px;
  border: none;
  background-color: #13b8ba;
  color: #fff;
  font-size: 15px;
  height: 44px;
  padding: 0 32px;
  font-weight: 500;
  cursor: pointer;
}
.appeals-actions {
  padding-top: 4px;
  padding-bottom: 4px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: end;
}
.appeals-filter {
  display: flex;
  column-gap: 8px;
}
.appeals-badges {
  display: flex;
  align-items: center;
  column-gap: 8px;
}
:deep(.q-field--dense .q-field__prepend) {
  padding-right: 8px;
}

.filter-badge {
  background-color: #fff;
  height: 36px;
  width: 36px;
  .q-badge {
    background-color: $accent;
    width: 17px;
    height: 17px;
    line-height: 17px;
    border-radius: 50%;
    font-size: 11px;
    justify-content: center;
    right: -4px;
    top: -5px;
  }
}

.filter-chip-dropdown {
  position: relative;

  &-content {
    z-index: 10;
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background-color: #fff;
    border-radius: 16px;
    box-shadow: 0px 0px 22px 0px #dae0eb;
  }

  &-btn {
    cursor: pointer;
    height: 36px;
    border: none;
    background: none;
    border-radius: 50px;
    background-color: #fff;
    color: #404f6f;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    &:hover {
      background-color: $lightgray;
    }
  }
}
</style>
