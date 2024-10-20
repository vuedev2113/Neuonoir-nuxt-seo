<script setup lang="ts">
const props = defineProps(["type"]);
</script>

<template>
  <div class="rounded-xl border border-neurolightgrey inline-block">
    <span class="my-auto mx-auto px-5 py-1 text-neurolightgrey">
      {{ props.type }}
    </span>
  </div>
</template>
