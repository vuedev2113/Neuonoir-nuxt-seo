<script setup lang="ts">
import Section from "~/components/layout/Section.vue";
import Container from "~/components/layout/Container.vue";
import SmallPost from "~/components/posts/SmallPost.vue";
import Product from "~/components/shop/Product.vue";
import SectionLight from "~/components/layout/SectionLight.vue";
import MainPostLight from "~/components/posts/MainPostLight.vue";

const config = useRuntimeConfig();

const featuredPostsResponse = await GqlFeaturedPost();
const featuredPosts = featuredPostsResponse.posts;

const postsResponse = await GqlHomePosts();
const posts = postsResponse.posts;

const productsResponse = await GqlGetFeaturedProducts();
const products = productsResponse.products;

const offersResponse = await GqlGetOffers();
const offers = offersResponse.offers;
useHead({
  title: "Neuronoir | Home",
  meta: [
    { name: "description", content: "Dark and Heavy music made in Romania." },
    { name: 'keywords', content: 'black metal, post black metal, post metal, post rock, atmospheric black metal, blackgaze, doomgaze, instrumental rock, instrumental metal, doom metal' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Neuronoir | Home' },
    { property: 'og:description', content: 'Dark and Heavy music made in Romania.' },
    { property: 'og:url', content: 'https://www.neuronoir.art' },
    { property: 'og:image', content: '/mstile-150x150.png' },
  ],
});
</script>

<template>
  <div>
    <Container class="bg-neurolight">
      <SectionLight
        title="Posts"
        description="Read our announcements, interviews and more about neuronoir music."
      ></SectionLight>
      <MainPostLight
        v-for="post, i in featuredPosts"
        :key="i"
        class="pb-5"
        :title="post.title"
        :date="post.date"
        :description="post.excerpt"
        :type="post.type"
        :image-url="post.image.url"
        :slug="post.slug"
      >
      </MainPostLight>
    </Container>
    <Container class="bg-neurodarkgreyvar">
      <div class="grid lg:grid-cols-2 grid-cols-1 gap-5 pt-12">
        <SmallPost
          v-for="post, i in posts"
          :key="i"
          class="pb-10"
          :title="post.title"
          :date="post.date"
          :description="post.excerpt"
          :type="post.type"
          :image-url="post.imageUrl"
          :slug="post.slug"
        >
        </SmallPost>
      </div>
      <div class="text-center py-8">
        <nuxt-link to="/posts">
          <div class="text-neurolink">. . .</div>
          <div class="text-neurolink">Read more posts</div>
        </nuxt-link>
      </div>
    </Container>
    <Container class="bg-neurodarkgrey" v-if="products">
      <Section
        title="Shop"
        description="Browse through our merchandise and other music related products."
      >
      </Section>
      <div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7">
        <div v-for="product, i in products" :key="i" class="col-span-1">
          <Product
            :offers="offers"
            :title="product.title"
            :type="product.type"
            :image-url="product.image.url"
            :brand="product.brand"
            :label="product.label"
            :slug="product.slug"
            :product-id="product.productId"
          ></Product>
        </div>
      </div>
      <div class="text-center py-8">
        <nuxt-link to="/shop">
          <div class="text-neurolink">. . .</div>
          <div class="text-neurolink">View more products</div>
        </nuxt-link>
      </div>
    </Container>
  </div>
</template>
