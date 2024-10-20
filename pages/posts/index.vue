<script setup lang="ts">
import SmallPost from "~/components/posts/SmallPost.vue";
import Section from "~/components/layout/Section.vue";
import MainPost from "~/components/posts/MainPost.vue";
import Container from "~/components/layout/Container.vue";

const featuredPostsResponse = await GqlFeaturedPost();
const featuredPosts = featuredPostsResponse.posts;

const postsResponse = await GqlAllPosts();
const posts = postsResponse.posts;

useHead({
  title: "Neuronoir | Posts",
  meta: [
    {
      name: "description",
      content:
        "Read our announcements, interviews and more about neuronoir music. Dark and Heavy music made in Romania.",
    },
    { name: 'keywords', content: 'music, post, Romania' },
    { property: 'og:title', content: 'Neuronoir | Posts' },
    { property: 'og:description', content: 'Read our announcements, interviews and more about neuronoir music. Dark and Heavy music made in Romania.' },
    { property: 'og:url', content: 'https://www.neuronoir.art/posts' },
  ],
});
</script>

<template>
  <Container class="bg-neurodarkgreyvar">
    <Section
      title="Posts"
      description="Read our announcements, interviews and more about neuronoir music."
    ></Section>
    <MainPost
      v-for="post, i in featuredPosts"
      :key="i"
      :title="post.title"
      :date="post.date"
      :description="post.excerpt"
      :type="post.type"
      :image-url="post.image.url"
      :slug="post.slug"
    ></MainPost>
    <div class="grid lg:grid-cols-2 grid-cols-1 gap-5 pt-12">
      <SmallPost
        v-for="post, i in posts"
        :key="i"
        class="pb-10"
        :title="post.title"
        :date="post.date"
        :description="post.excerpt"
        :type="post.type"
        :slug="post.slug"
      ></SmallPost>
    </div>
  </Container>
</template>
