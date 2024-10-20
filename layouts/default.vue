<script>
import Header from "~/components/layout/Header.vue";
import Discord from "~/components/layout/Discord.vue";
import Footer from "~/components/layout/Footer.vue";
import Spotify from "~/components/layout/Spotify.vue";

export default {
  name: "NuxtLayout",
  components: { Spotify, Footer, Discord, Header },
};
</script>

<template>
  <Header class="sticky top-0 z-10" />
  <NuxtPage class="z-0" />
  <Discord />
  <Spotify />
  <Footer />
</template>

<style>
body {
  font-family: "Barlow Semi Condensed";
  width: 100%;
  overflow-x: hidden;
}
</style>
