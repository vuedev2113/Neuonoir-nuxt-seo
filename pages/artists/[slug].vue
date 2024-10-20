<script setup lang="ts">

const config = useRuntimeConfig()

import SmallPost from "~/components/posts/SmallPost.vue";
import Container from "~/components/layout/Container.vue";
import PostType from "~/components/posts/PostType.vue";
import Section from "~/components/layout/Section.vue";
import Product from "~/components/shop/Product.vue";

const { params } = useRoute()


const response = await GqlGetArtist({
	slug: params.slug.toString()
})
const artist = response.artist

const title = `Neuronoir | ${artist.name}`
useHead({
	title: title,
    meta: [
		{ name: 'keywords', content: artist.name },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: artist.description.markdown },
	]
})

useSeoMeta({
	title: title,
	ogTitle: title,
	ogImage: artist.profileImage.url,
	ogDescription: artist.description.markdown,
	twitterCard: artist.profileImage.url,
})

const offersResponse = await GqlGetOffers();
const offers = offersResponse.offers;
</script>

<template>
	<div>
		<Container class="bg-neurodarkgreyvar">
			<div class="py-10">
				<nuxt-link to="/artists" class="block text-neurolink mb-20">Back to all artists</nuxt-link>
				<PostType :type="artist.genre" class="mb-3" />
				<nuxt-img :alt="artist.name" :src="artist.profileImage.url" class="lg:float-right w-60 rounded" />
				<h2 class="text-white font-bold text-4xl max-lg:pt-5 uppercase">{{artist.name}}</h2>
				<p class="text-white opacity-50 pt-10">{{ artist.description.markdown }}</p>
				<div class="pt-5">
					<a :href="social.url" class="text-neurolink mr-2" v-for="social in artist.links">
						<Icon :name="social.icon" size="22px"/>
					</a>
				</div>
			</div>
		</Container>
		<Container class="bg-neurodarkgrey py-24" v-if="artist.posts.length">
			<Section
				title="Posts"
				:description="`Read announcements, interviews and more about ${artist.name}.`"
			></Section>
			<div class="grid lg:grid-cols-2 grid-cols-1 gap-5 pt-12">
				<SmallPost
					v-for="post in artist.posts"
					class="pb-10"
					:title="post.title"
					:date="post.date"
					:description="post.description"
					:type="post.type"
					:image-url="post.imageUrl"
					:slug="post.slug"
				></SmallPost>
			</div>
		</Container>
		<Container :class="`${artist.posts.length ? 'bg-neurodarkgreyvar' : 'bg-neurodarkgrey'} py-24`" v-if="artist.products.length">
			<Section
				title="Shop"
				description="Browse through merchandise and other music related products."
			></Section>
			<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7">
				<div class="col-span-1" v-for="product in artist.products">
					<Product
						:title="product.title"
						:type="product.type"
						:image-url="product.image.url"
						:brand="product.brand"
						:label="product.label"
						:price="product.price"
						:slug="product.slug"
						:product-id="product.productId"
						:offers="offers"
					></Product>
				</div>
			</div>
		</Container>
	</div>
</template>
