<template>
  <q-item class="q-py-none q-px-sm">
    <router-link :to="routeTo" class="flex q-px-sm q-py-sm nav-item">
      <q-item-section side class="q-pr-xs">
        <q-icon size="20">
          <slot name="icon"></slot>
        </q-icon>
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ caption }}</q-item-label>
      </q-item-section>
    </router-link>
  </q-item>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: "",
  },
  caption: {
    type: String,
    default: "",
  },
  routeTo: {
    type: Object,
    default: () => {
      return { path: "/" };
    },
  },
});
</script>

<style lang="scss" scoped>
.nav-item {
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  font-size: 15px;
  line-height: 20px;
  text-decoration: none;
  color: $primary;
}
.router-link-exact-active {
  background-color: $hover;
}
.q-item {
  margin-bottom: 2px;
}
.no-hover:hover {
  background: none;
}
.nav-item:hover {
  background-color: $hover;
}
</style>
