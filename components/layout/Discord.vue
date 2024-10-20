<script setup lang="ts">
import Container from "~/components/layout/Container.vue";
</script>

<template>
  <Container class="bg-discord py-12">
    <div class="flex flex-row overflow-hidden">
      <div class="my-auto">
        <h3 class="text-3xl font-bold text-neurodarkgrey opacity-70 uppercase">
          Discord
        </h3>
        <h5 class="text-white opacity-50 pb-24">
          Come hang out with us and stay updated with the latest news.
        </h5>
        <a href="https://discord.gg/w3GJKkh7J3" target="_blank"
          class="px-10 py-3 bg-neurodarkgrey inline-block text-white opacity-70 rounded">
          Join our Discord server
        </a>
      </div>
      <div class="ml-auto rotate-12 my-auto max-md:hidden">
        <Icon size="250px" name="iconoir:discord" class="text-white" />
      </div>
    </div>
  </Container>
</template>
