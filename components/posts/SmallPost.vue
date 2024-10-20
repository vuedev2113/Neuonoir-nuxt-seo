<script setup lang="ts">
import PostType from "~/components/posts/PostType.vue";
import ReadMore from "~/components/posts/ReadMore.vue";
import moment from "moment/moment";

const post = defineProps([
  "date",
  "type",
  "title",
  "description",
  "slug",
  "imageUrl",
]);
const link = `/posts/${post.slug}`;
</script>

<template>
  <div class="flex flex-row w-full">
    <div>
      <PostType class="mb-4" :type="post.type" />
      <div class="flex flex-row pb-1">
        <div  class="my-auto border-r py-1 border-neurolightgrey h-full mr-5 pr-2">
          <div class="text-2xl font-bold text-white">
            {{ moment(post.date).format("DD") }}
          </div>
          <div class="opacity-50 text-white uppercase">
            {{ moment(post.date).format("MMM") }}
          </div>
        </div>
        <nuxt-link :to="link" class="my-auto">
          <h5 class="text-3xl font-bold text-white pb-1">{{ post.title }}</h5>
        </nuxt-link>
      </div>
      <p class="text-white opacity-50 pb-10">{{ post.description }}</p>
      <ReadMore :link="link" />
    </div>
  </div>
</template>

<style scoped></style>
