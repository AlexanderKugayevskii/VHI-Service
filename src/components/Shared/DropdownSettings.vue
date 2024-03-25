<template>
  <q-btn
    flat
    class="btn--no-hover user-settings-btn"
    :ripple="false"
    @click="handleClickBtn"
  >
    <slot name="icon"></slot>

    <q-menu :max-width="null" :offset="[16, 8]">
      <q-list>
        <slot name="options"></slot>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { ref } from "vue";

const handleClickBtn = (e) => {
  e.stopPropagation();
};
</script>

<style lang="scss"></style>
