<script setup lang="ts">
import Container from "~/components/layout/Container.vue";
import links, { extraLinks } from "~/composables/links";
</script>

<template>
  <Container class="bg-neurodarkgrey">
    <div class="py-12 flex sm:flex-row flex-col">
      <div class="my-auto">
        <h3 id="logo" class="text-4xl inline-flex font-bold">
          <nuxt-link to="/">
            <span class="text-white">neuro</span>
            <span class="opacity-50 text-white">noir</span>
          </nuxt-link>
        </h3>
        <h5 class="text-white opacity-50 font-light pt-2">Dark and Heavy music made in Romania</h5>
        <div class="pt-10">
          <nuxt-link v-for="{ to, target, icon }, i in extraLinks" :key="i" :to="to" :target="target" class="pr-4">
            <Icon size="22px" :name="icon" class="text-neurolightgrey hover:text-neurolink" />
          </nuxt-link>
        </div>
        <nuxt-link to="/privacy" class="text-neurolink pt-12 block">
          Privacy Policy
        </nuxt-link>
      </div>
      <div class="sm:pl-24 pl-0 my-auto max-lg:py-12">
        <ul class="text-lg">
          <li v-for="{ title, to }, i in links" :key="i" class="pb-4 text-white">
            <nuxt-link :to="to">{{ title }}</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="ml-auto my-auto">
        <a href="https://anpc.ro/ce-este-sal/" class="block mb-5" target="_blank">
          <nuxt-img width="250" height="62" alt="anpc" src="/ANPC.png"/>
        </a>
        <a href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home.chooseLanguage" target="_blank">
          <nuxt-img width="250" height="62" alt="sol" src="/SOL.png" />
        </a>
      </div>
    </div>
  </Container>
</template>

<style scoped>
#logo {
  font-family: 'Cabin Sketch';
}
</style>
