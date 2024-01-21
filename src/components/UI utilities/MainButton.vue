<script setup>
const props = defineProps({
  className: {
    type: String,
    default: 'primary',
  },
  paddingX: {
    type: String,
    default: 'q-px-xl'
  }
})

</script>

<template>
  <button
      :class="['q-py-sm', paddingX, props.className] "
  >
  </button>
</template>

<style scoped lang="scss">
.primary{

}
.secondary{

}
</style>