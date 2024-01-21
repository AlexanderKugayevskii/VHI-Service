<template>
  <router-view />

</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
import { useClientsStore } from "./stores/clientsStore";

export default defineComponent({
  name: "App",

  setup() {
    const clientStore = useClientsStore();


    return {
      clientStore,
    };
  },
});
</script>
