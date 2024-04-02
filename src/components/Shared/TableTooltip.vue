<template>
  <q-tooltip
    :delay="100"
    max-width="300px"
    self="bottom middle"
    :offset="[0, -44]"
    class="custom-tooltip"
    transition-show="scale"
    transition-duration="200"
    v-model="showTooltip"
    @before-show="checkShow"
  >
    <span class="custom-tooltip-tongue">
      <q-icon size="22px">
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
            d="M10 8C13 8 15.9999 0 20 0L0 0C3.9749 0 7 8 10 8Z"
            fill="#596787"
          />
        </svg>
      </q-icon>
    </span>
    <slot name="default"></slot>
  </q-tooltip>
</template>

<style lang="scss">
.custom-tooltip {
  font-size: 13px;
  line-height: 18px;
  padding: 12px;
  background-color: #596787;
  border-radius: 16px;
  /* position: relative; */
  overflow: visible;

  &-tongue {
    position: absolute;
    top: calc(100% - 7px);
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

<script setup>
import { ref } from "vue";
const showTooltip = ref(false);

const checkShow = (e) => {
  const show = e.target;
  if (show.scrollWidth <= show.offsetWidth) {
    showTooltip.value = false;
    return;
  } else {
    showTooltip.value = true;
  }
};
</script>
