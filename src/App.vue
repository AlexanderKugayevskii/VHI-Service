<template>
  <router-view />
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { useAuthStore } from "src/stores/authStore";

export default defineComponent({
  name: "App",

  setup() {
    const authStore = useAuthStore();
    authStore.initializeFromLocalStorage();
    return { authStore };
  },
});
</script>
