<template>
  <q-btn flat class="btn--no-hover user-settings-btn" :ripple="false">
    <slot name="icon"></slot>

    <q-menu :max-width="null" :offset="[16, 8]">
      <q-list>
        <slot name="options"></slot>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup></script>

<style lang="scss"></style>
