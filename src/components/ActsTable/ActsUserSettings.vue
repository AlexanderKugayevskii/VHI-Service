<template>
  <div class="user-settings">
    <DropdownSettings>
      <template v-slot:icon>
        <q-icon size="20px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M10 10.8333C10.221 10.8333 10.433 10.7455 10.5893 10.5892C10.7456 10.433 10.8334 10.221 10.8334 9.99998C10.8334 9.77897 10.7456 9.567 10.5893 9.41072C10.433 9.25444 10.221 9.16665 10 9.16665C9.77901 9.16665 9.56704 9.25444 9.41076 9.41072C9.25448 9.56701 9.16669 9.77897 9.16669 9.99998C9.16669 10.221 9.25448 10.433 9.41076 10.5892C9.56704 10.7455 9.77901 10.8333 10 10.8333Z"
              fill="#404F6F"
              stroke="#404F6F"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M15.8333 10.8333C16.0543 10.8333 16.2663 10.7455 16.4226 10.5892C16.5789 10.433 16.6667 10.221 16.6667 9.99998C16.6667 9.77897 16.5789 9.567 16.4226 9.41072C16.2663 9.25444 16.0543 9.16665 15.8333 9.16665C15.6123 9.16665 15.4004 9.25444 15.2441 9.41072C15.0878 9.56701 15 9.77897 15 9.99998C15 10.221 15.0878 10.433 15.2441 10.5892C15.4004 10.7455 15.6123 10.8333 15.8333 10.8333Z"
              stroke="#404F6F"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.16665 10.8333C4.38766 10.8333 4.59962 10.7455 4.7559 10.5892C4.91218 10.433 4.99998 10.221 4.99998 9.99998C4.99998 9.77897 4.91218 9.567 4.7559 9.41072C4.59962 9.25444 4.38766 9.16665 4.16665 9.16665C3.94563 9.16665 3.73367 9.25444 3.57739 9.41072C3.42111 9.56701 3.33331 9.77897 3.33331 9.99998C3.33331 10.221 3.42111 10.433 3.57739 10.5892C3.73367 10.7455 3.94563 10.8333 4.16665 10.8333Z"
              stroke="#404F6F"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </q-icon>
      </template>
      <template v-slot:options>
        <q-item
          clickable
          v-close-popup
          class="item--no-hover"
          @click.prevent.stop="deleteAppeal"
          v-if="!isClinic"
        >
          <q-icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M18.5001 4H1.5"
                stroke="#E3E8F0"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M16.8332 6.5L16.3732 13.3991C16.1962 16.054 16.1077 17.3815 15.2427 18.1907C14.3777 19 13.0473 19 10.3865 19H9.6132C6.95235 19 5.62195 19 4.75694 18.1907C3.89194 17.3815 3.80344 16.054 3.62644 13.3991L3.1665 6.5"
                stroke="#E3E8F0"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M4.5 4C4.55588 4 4.58382 4 4.60915 3.99936C5.43259 3.97849 6.15902 3.45491 6.43922 2.68032C6.44784 2.65649 6.45667 2.62999 6.47434 2.57697L6.57143 2.28571C6.65431 2.03708 6.69575 1.91276 6.75071 1.8072C6.97001 1.38607 7.37574 1.09364 7.84461 1.01877C7.96213 1 8.0932 1 8.3553 1H11.6447C11.9068 1 12.0379 1 12.1554 1.01877C12.6243 1.09364 13.03 1.38607 13.2493 1.8072C13.3043 1.91276 13.3457 2.03708 13.4286 2.28571L13.5257 2.57697C13.5433 2.62992 13.5522 2.65651 13.5608 2.68032C13.841 3.45491 14.5674 3.97849 15.3909 3.99936C15.4162 4 15.4441 4 15.5 4"
                stroke="#E3E8F0"
                stroke-width="2"
              />
            </svg>
          </q-icon>
          <span class="option-text">Удалить</span>
        </q-item>
      </template>
    </DropdownSettings>
  </div>
  <ConfirmModal />
</template>

<script setup>
import DropdownSettings from "../Shared/DropdownSettings.vue";
import ConfirmModal from "../Shared/ConfirmModal.vue";
import { useQuasar } from "quasar";
import { useAppealStore } from "src/stores/appealStore";
import { useI18n } from "vue-i18n";
const emit = defineEmits(["openModal", "openModalLimit", "deleteAppeal"]);
const props = defineProps(["client"]);
const $q = useQuasar();

const { t } = useI18n();
const { isClinic } = useAppealStore();

const openAppealPage = async () => {
  emit("openModal");
};
const openAppealLimit = async () => {
  emit("openModalLimit");
};
const deleteAppeal = async () => {
  $q.dialog({
    component: ConfirmModal,
    componentProps: {
      title: t("act.delete"),
    },
  }).onOk(() => {
    emit("deleteAppeal");
  });
};
</script>

<style lang="scss" scoped>
.user-settings-btn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
}
.q-item {
  background-color: transparent;
  min-height: 0;
  padding: 8px;
  column-gap: 8px;
  align-items: center;
  border-radius: 8px;
  &:hover {
    background-color: #596787;
  }
}
.option-text {
  font-size: 15px;
  line-height: 20px;
  color: #f2f5fa;
}
</style>
