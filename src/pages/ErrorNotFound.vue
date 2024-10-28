<template>
  <div
    class="fullscreen text-white text-center q-pa-md flex flex-center wrapper"
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">
        {{ $t("common.not_found") }}
      </div>

      <q-btn
        class="q-mt-xl btn"
        color="white"
        unelevated
        to="/"
        label="Назад"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: $accent;
}
</style>
