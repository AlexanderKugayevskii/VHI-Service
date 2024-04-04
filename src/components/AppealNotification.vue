<template>
  <div class="notification" id="notification">
    <div class="notification-header">
      <q-btn
        dense
        flat
        :ripple="false"
        class="btn--no-hover"
        @click="handleDropdown"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.777 18H6.22301C4.39401 18 3.35101 16.16 4.44801 14.872C4.93301 14.302 5.23301 13.625 5.31301 12.915L5.76001 8.975C6.00201 6.851 7.58801 5.107 9.73001 4.374V4.27C9.73001 3.9719 9.78872 3.67672 9.9028 3.40131C10.0169 3.1259 10.1841 2.87566 10.3949 2.66487C10.6057 2.45408 10.8559 2.28687 11.1313 2.17279C11.4067 2.05872 11.7019 2 12 2C12.2981 2 12.5933 2.05872 12.8687 2.17279C13.1441 2.28687 13.3944 2.45408 13.6051 2.66487C13.8159 2.87566 13.9831 3.1259 14.0972 3.40131C14.2113 3.67672 14.27 3.9719 14.27 4.27V4.374C16.412 5.107 17.998 6.851 18.24 8.975L18.687 12.915C18.767 13.625 19.067 14.302 19.552 14.872C20.65 16.161 19.606 18 17.777 18ZM14.972 20.072C14.515 21.198 13.357 22 12 22C10.643 22 9.48501 21.2 9.02801 20.072C9.00394 20.0081 8.99572 19.9392 9.00405 19.8714C9.01238 19.8036 9.037 19.7388 9.07582 19.6826C9.11464 19.6264 9.1665 19.5804 9.22696 19.5486C9.28742 19.5168 9.35469 19.5001 9.42301 19.5H14.577C14.6453 19.5001 14.7126 19.5168 14.7731 19.5486C14.8335 19.5804 14.8854 19.6264 14.9242 19.6826C14.963 19.7388 14.9876 19.8036 14.996 19.8714C15.0043 19.9392 14.9961 20.0081 14.972 20.072Z"
            fill="#7A88A6"
          />
        </svg>
        <q-badge class="notification-badge" floating rounded>4</q-badge>
      </q-btn>
    </div>

    <Transition name="fade">
      <div
        v-click-out-side="closeModal"
        class="dropdown-select"
        key="dropdown-select"
        ref="dropdownSelectRef"
        v-if="showDropdown"
      >
        <span class="dropdown-select-tongue">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="8"
            viewBox="0 0 20 8"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10 0C13 0 15.9999 8 20 8L0 8C3.9749 8 7 0 10 0Z"
              fill="white"
            />
          </svg>
        </span>
        <div class="dropdown-select-scroll" id="virtual-scroll-target">
          <!-- loading -->
          <div class="dropdown-loading flex flex-center">
            <q-spinner-tail color="teal" size="20px" />
          </div>

          <!-- nothing notification -->
          <div
            class="dropdown-select-error-message flex column items-stretch"
          ></div>

          <!-- has notifications -->
          <!-- <q-virtual-scroll
            scroll-target="#virtual-scroll-target"
          ></q-virtual-scroll> -->
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import clickOutSide from "@mahdikhashan/vue3-click-outside";
import { ref, onMounted } from "vue";

export default {
  name: "appealNotification",
  directives: {
    clickOutSide,
  },

  data() {
    return {
      showDropdown: false,
      dropdownActive: false,
    };
  },

  setup() {
    const scrollTarget = ref(null);
    const virtualListScrollTargetRef = ref(null);

    onMounted(() => {
      scrollTarget.value = virtualListScrollTargetRef.value;
    });
    return {
      virtualListScrollTargetRef,
      scrollTarget,
    };
  },

  methods: {
    closeModal(event) {
      if (this.dropdownActive) {
        return;
      }
      this.showDropdown = false;
      if (this.$slots.action) {
        this.searchValue = "";
      }
    },

    handleDropdown() {
      this.showDropdown = !this.showDropdown;
      this.dropdownActive = true;
      if (!this.showDropdown) {
        this.searchValue = "";
      }
      setTimeout(() => {
        this.dropdownActive = false;
      }, 50);
    },
  },
};
</script>

<style scoped lang="scss">
.notification-badge {
  background: #13b8ba;
  border: 1px solid #fff;
}

.dropdown-select {
  position: absolute;
  top: calc(100%);
  right: 20px;
  width: 400px;
  z-index: 10;
  border-radius: 16px;
  padding: var(--spacing-5, 20px) var(--spacing-2, 8px) var(--spacing-5, 20px)
    var(--spacing-3, 12px);

  background-color: #fff;
  box-shadow: 0px 0px 8px 0px #cfd9ea;

  &-tongue {
    position: absolute;
    bottom: calc(100% - 2px);
    right: 0;
    transform: translateX(-50%);
  }
}
.dropdown-select-scroll {
  padding: 0 4px 0 4px;
  max-height: 600px;
  height: 600px; //temp
  overflow-y: auto;
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
</style>
