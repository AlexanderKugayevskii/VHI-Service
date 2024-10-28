<template>
  <q-dialog ref="appealTypeModalRef" no-backdrop-dismiss>
    <div class="modal-container appeal-search-container">
      <div class="modal-header">
        <h4 class="page-title q-my-none">{{ $t('appeal_search.type_of_appeal') }}</h4>
        <button type="button" class="btn-close" @click="hideModal">
          <q-icon size="20px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M11 1L1 11"
                stroke="#D0D8E6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 1L11 11"
                stroke="#D0D8E6"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </q-icon>
        </button>
      </div>
      <div class="modal-body">
        <div class="type-container">
          <div
            :class="['type-item', { selected: type === 0 }]"
            @click="setType(0)"
          >
            <q-icon size="24px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12 1.75C11.1339 1.75 10.3597 2.02688 9.52381 2.49594C8.7139 2.95043 7.78586 3.62145 6.61887 4.46524L5.10984 5.55632C4.1733 6.23346 3.42528 6.77429 2.86109 7.27487C2.27855 7.79173 1.84274 8.307 1.5663 8.95513C1.28925 9.60469 1.22225 10.2705 1.25941 11.0381C1.29528 11.7789 1.43264 12.6727 1.60393 13.7872L1.91918 15.8387C2.16256 17.4225 2.35635 18.6836 2.64105 19.6662C2.93544 20.6821 3.35016 21.4887 4.0914 22.1052C4.82957 22.7192 5.7089 22.9926 6.78306 23.1231C7.828 23.25 9.14615 23.25 10.8111 23.25H13.1889C14.8539 23.25 16.172 23.25 17.2169 23.1231C18.2911 22.9926 19.1704 22.7192 19.9086 22.1052C20.6499 21.4887 21.0646 20.6821 21.359 19.6662C21.6437 18.6837 21.8374 17.4225 22.0808 15.8387L22.3961 13.7871C22.5674 12.6726 22.7047 11.7789 22.7406 11.0381C22.7778 10.2705 22.7108 9.60469 22.4337 8.95513C22.1573 8.307 21.7215 7.79173 21.1389 7.27487C20.5747 6.7743 19.8267 6.23347 18.8902 5.55633L17.3811 4.46525C16.2141 3.62147 15.2861 2.95043 14.4762 2.49594C13.6403 2.02688 12.8661 1.75 12 1.75ZM13 10.5C13 9.94771 12.5523 9.5 12 9.5C11.4477 9.5 11 9.94771 11 10.5V12.5H9C8.44772 12.5 8 12.9477 8 13.5C8 14.0523 8.44772 14.5 9 14.5H11V16.5C11 17.0523 11.4477 17.5 12 17.5C12.5523 17.5 13 17.0523 13 16.5V14.5H15C15.5523 14.5 16 14.0523 16 13.5C16 12.9477 15.5523 12.5 15 12.5H13V10.5Z"
                  fill="#13B8BA"
                />
              </svg>
            </q-icon>
            <span>{{$t('client_table.clinic')}}</span>
          </div>

          <div
            :class="['type-item', { selected: type === 1 }]"
            @click="setType(1)"
          >
            <q-icon size="24px">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M7.13816 1.75001C7.15562 1.75001 7.1731 1.75001 7.19059 1.75001H12.8094C12.8269 1.75001 12.8444 1.75001 12.8618 1.75001C13.2576 1.74992 13.6463 1.74984 13.9676 1.79213C14.333 1.84021 14.7496 1.95785 15.0935 2.2945C15.4173 2.61146 15.5592 3.05295 15.6317 3.36788C15.7136 3.72385 15.75 4.12047 15.75 4.5C15.75 4.87953 15.7136 5.27615 15.6317 5.63212C15.5592 5.94705 15.4173 6.38854 15.0935 6.7055C14.7496 7.04215 14.333 7.15979 13.9676 7.20787C13.6463 7.25016 13.2576 7.25008 12.8618 7.24999C12.8444 7.24999 12.8269 7.24999 12.8094 7.24999H7.19059C7.1731 7.24999 7.15562 7.24999 7.13816 7.24999C6.7424 7.25008 6.35373 7.25016 6.03241 7.20787C5.66703 7.15979 5.25045 7.04215 4.90652 6.7055C4.58272 6.38854 4.44081 5.94705 4.36832 5.63212C4.28638 5.27615 4.25 4.87953 4.25 4.5C4.25 4.12047 4.28638 3.72385 4.36832 3.36788C4.44081 3.05295 4.58272 2.61146 4.90652 2.2945C5.25045 1.95785 5.66703 1.84021 6.03241 1.79213C6.35372 1.74984 6.7424 1.74992 7.13816 1.75001ZM6.28313 3.60977C6.27092 3.64465 6.25575 3.69431 6.24015 3.76208C6.19422 3.96164 6.16667 4.22227 6.16667 4.5C6.16667 4.77773 6.19422 5.03836 6.24015 5.23792C6.25575 5.30569 6.27092 5.35535 6.28313 5.39023C6.28651 5.3907 6.29002 5.39118 6.29366 5.39166C6.46819 5.41462 6.72143 5.41666 7.19059 5.41666H12.8094C13.2786 5.41666 13.5318 5.41462 13.7063 5.39166C13.71 5.39118 13.7135 5.3907 13.7169 5.39023C13.7291 5.35535 13.7442 5.30569 13.7598 5.23792C13.8058 5.03836 13.8333 4.77773 13.8333 4.5C13.8333 4.22227 13.8058 3.96164 13.7598 3.76208C13.7442 3.69431 13.7291 3.64465 13.7169 3.60977C13.7135 3.6093 13.71 3.60882 13.7063 3.60834C13.5318 3.58538 13.2786 3.58334 12.8094 3.58334H7.19059C6.72143 3.58334 6.46819 3.58538 6.29366 3.60834C6.29002 3.60882 6.28651 3.6093 6.28313 3.60977Z"
                  fill="#13B8BA"
                />
                <path
                  d="M17.9496 14.9396C18.1609 14.6817 18.2665 14.5528 18.2286 14.4055C18.1906 14.2582 18.0484 14.2014 17.7641 14.0877C15.8914 13.3393 13.6735 13.847 12.3276 15.49C10.9817 17.133 10.9204 19.4074 12.0228 21.0961C12.1902 21.3526 12.2739 21.4808 12.4258 21.489C12.5777 21.4972 12.6833 21.3682 12.8946 21.1103L17.9496 14.9396Z"
                  fill="#13B8BA"
                />
                <path
                  d="M19.1099 15.8904C19.3212 15.6324 19.4269 15.5035 19.5788 15.5117C19.7307 15.5199 19.8143 15.6482 19.9817 15.9047C21.0836 17.5933 21.0222 19.8673 19.6765 21.5101C18.3307 23.1528 16.1133 23.6606 14.2408 22.9127C13.9564 22.799 13.8142 22.7422 13.7762 22.5949C13.7382 22.4476 13.8439 22.3187 14.0552 22.0607L19.1099 15.8904Z"
                  fill="#13B8BA"
                />
                <path
                  d="M5.32919 6.83541L5.22065 6.61833C5.02606 6.22915 4.92877 6.03456 5.0167 5.89228C5.10464 5.75 5.32219 5.75 5.75731 5.75H14.2427C14.6778 5.75 14.8954 5.75 14.9833 5.89228C15.0713 6.03456 14.974 6.22915 14.7794 6.61833L14.6708 6.83541C14.4978 7.18154 14.4391 7.30153 14.3986 7.4126C14.169 8.04218 14.2321 8.74131 14.5705 9.31968C14.6302 9.42171 14.7095 9.52926 14.9417 9.83885L15.3878 10.4337C15.7972 10.9794 16.0611 11.3312 16.2551 11.7223C16.2991 11.811 16.3211 11.8553 16.3285 11.8993C16.3525 12.0435 16.264 12.1891 16.1249 12.2341C16.0825 12.2478 16.0191 12.249 15.8923 12.2513C14.1229 12.2829 12.3777 13.0617 11.1672 14.5394C9.39479 16.703 9.31697 19.6953 10.7667 21.9161C10.7958 21.9686 10.8309 22.0275 10.8715 22.0914C11.2307 22.6561 11.4103 22.9384 11.3249 23.094C11.2395 23.2496 10.9391 23.2497 10.3382 23.25C10.2451 23.25 10.1506 23.25 10.0549 23.25C8.68729 23.25 7.47523 23.25 6.60826 23.1335C5.70815 23.0125 4.95028 22.7536 4.34836 22.1516C3.74644 21.5497 3.48755 20.7919 3.36653 19.8918C3.24997 19.0248 3.24999 17.9225 3.25001 16.5549V14.5204C3.24991 13.8382 3.24985 13.3984 3.3293 12.9691C3.40939 12.5362 3.54926 12.1166 3.74489 11.7223C3.93894 11.3312 4.20283 10.9794 4.6122 10.4337L5.05837 9.83885C5.29057 9.52926 5.36978 9.42171 5.42948 9.31968C5.76794 8.74131 5.83098 8.04218 5.60144 7.41259C5.56095 7.30154 5.50225 7.18153 5.32919 6.83541Z"
                  fill="#13B8BA"
                />
              </svg>
            </q-icon>
            <span>{{$t('client_table.drugstore')}}</span>

          </div>
        </div>
      </div>
      <div class="modal-footer">
        <SimpleButton
          :label="$t('appeal_search.cancel')"
          custom-class="btn-cancel"
          @click="hideModal"
        />
        <SimpleButton
          :label="$t('create_appeal.buttons.create_appeal')"
          :custom-class="['btn-action']"
          :disabled="type === null"
          @click="goToAppeal"
        ></SimpleButton>
      </div>
    </div>
  </q-dialog>
</template>

<script setup>
import { useSearchClientsStore } from "src/stores/clientSearchStore";
import { useQuasar } from "quasar";
import { ref } from "vue";
import SimpleButton from "src/components/Shared/SimpleButton.vue";
import { useRouter } from "vue-router";

import { useAppealStore } from "src/stores/appealStore";
import Trans from "src/i18n/translation";

const appealStore = useAppealStore();
const searchClientsStore = useSearchClientsStore();
const router = useRouter();
const $q = useQuasar();

const appealTypeModalRef = ref(null);
const type = ref(null); //clinic or drugstore

const emit = defineEmits(["move-back"]);

const setType = (value) => {
  type.value = value;
};

const hideModal = () => {
  appealTypeModalRef.value.hide();
  emit("move-back", true);
};

const goToAppeal = async () => {
  appealTypeModalRef.value.hide();
  const localClient = $q.sessionStorage.getItem("client");
  if (type.value === 0) {
    await appealStore.setClinic();
    appealStore.setTypeOfAppeal("NEW");
    router.push(
      Trans.i18nRoute({
        name: "createAppeal",
        params: {
          id: appealStore.client.id,
        },
      })
    );
  } else if (type.value === 1) {
    appealStore.setTypeOfAppeal("NEW");
    router.push(
      Trans.i18nRoute({
        name: "createDrugsAppeal",
        params: {
          id: appealStore.client.id,
        },
      })
    );
  }

  searchClientsStore.clearClients();
};
</script>
<style lang="scss" scoped>
.appeal-search-container {
  min-width: 600px;
}
.tab-header {
  margin-bottom: 20px;
}
.type-container {
  display: flex;
  column-gap: 16px;
}
.type-item {
  background-color: #f2f5fa;
  padding: 16px;
  border-radius: 16px;
  flex-basis: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 4px;
  cursor: pointer;
  transition: 0.3s;

  &.selected {
    background-color: #e0fafb;
  }

  span {
    font-size: 15px;
    line-height: 20px;
    font-weight: 500;
    color: #404f6f;
  }
}
</style>
