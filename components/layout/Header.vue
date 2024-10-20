<script setup lang="ts">
import Container from "~/components/layout/Container.vue";
import NavBtn from "~/components/layout/NavBtn.vue";
import links, { extraLinks } from "~/composables/links";
</script>

<template>
  <Container class="bg-neurodarkgrey flex flex-row relative" style="overflow-x: visible;">
    <h1 id="logo" class="text-4xl inline-flex font-bold my-auto">
      <nuxt-link to="/">
        <span class="text-white">neuro</span>
        <span class="opacity-50 text-white">noir</span>
      </nuxt-link>
    </h1>
    <div class="menu text-white my-auto mx-auto max-sm:hidden">
      <ul class="flex flex-row gap-4">
        <li v-for="({ title, to }, i) in links" :key="i" class="inline-flex text-neurolightgrey">
          <nuxt-link :to="to">{{ title }}</nuxt-link>
        </li>
      </ul>
    </div>
    <div class="inline-flex my-auto max-sm:hidden">
      <nuxt-link v-for="({ to, target, icon }, i) in extraLinks" :key="i" class="pr-4" :target="target" :to="to">
        <Icon size="22px" :name="icon" class="text-neurolightgrey hover:text-neurolink" />
      </nuxt-link>
    </div>
    <NavBtn />
  </Container>
</template>

<style scoped>
#logo {
  font-family: "Cabin Sketch";
}

.router-link-active {
  color: white;
}
</style>
