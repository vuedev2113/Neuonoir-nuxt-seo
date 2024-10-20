<script setup lang="ts">
const props = defineProps(["title", "description"]);
</script>

<template>
  <div class="pt-10 pb-16">
    <h2 class="text-3xl uppercase font-bold text-neurodarkgrey">{{ props.title }}</h2>
    <h4 class="opacity-50 font-light text-neurodarkgrey">{{ props.description }}</h4>
  </div>
</template>
