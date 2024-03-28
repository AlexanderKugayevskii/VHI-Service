<template>
  <q-item class="q-py-none q-px-none">
    <router-link :to="routeTo" class="nav-item flex" :disabled="disabled">
      <slot name="icon"></slot>

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
  disableLink: {
    type: Boolean,
    default: false,
  }
});
</script>

<style lang="scss" scoped>
:global(.nav-item) {
  border-radius: 12px;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
  font-size: 15px;
  column-gap: 8px;
  text-decoration: none;
  padding: 12px 12px 12px 20px;
  color: $primary;
}

.router-link-exact-active {
  background-color: $hover;
}
.nav-item.router-link-active {
  background-color: $hover;
}
.q-item {
  margin-bottom: 2px;
}
.no-hover:hover {
  background: none;
}
.nav-item-btn:hover {
  background-color: $hover;
}
</style>
