<script setup lang="ts">
const props = defineProps(["link"]);
</script>

<template>
  <nuxt-link :to="props.link" class="text-neuroprimary font-bold px-1 pb-1 border-b border-neurolink">
    Read more
  </nuxt-link>
</template>
