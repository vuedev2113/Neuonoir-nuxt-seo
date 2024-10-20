<script setup lang="ts">
const props = defineProps(["link"]);
</script>

<template>
  <nuxt-link :to="props.link" class="text-white px-1 pb-1 border-b border-neurolink font-bold">
    Read More
  </nuxt-link>
</template>
