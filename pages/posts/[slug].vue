<script setup lang="ts">
import Container from "~/components/layout/Container.vue";
import PostType from "~/components/posts/PostType.vue";
import moment from 'moment';

const config = useRuntimeConfig()
const { params } = useRoute()

const response = await GqlGetPost({
	slug: params.slug.toString()
})
const post = response.post
const title = `Neuronoir | ${post.title}`

useHead({
	title: title,
	meta: [
		{ name: 'description', content: post.excerpt},
		{ name: 'keywords', content: title },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: post.excerpt },
	]
})

useSeoMeta({
	title: title,
	ogTitle: title,
	ogImage: post.image.url,
	twitterCard: post.image.url,
	description: post.excerpt,
	ogDescription: post.excerpt,
})
</script>

<template>
	<div>
		<Container class="bg-neurodarkgreyvar">
			<div class="w-full py-12">
				<div class="float-right w-64">
					<nuxt-img :alt="post.title" :src="post.image.url" class="sm:pl-5 pl-0 pb-5" />
				</div>
				<PostType :type="post.type"/>
				<h2 class="text-4xl font-bold text-white py-8 max-w-2xl">{{ post.title }}</h2>
				<div class="text-white pb-10">
					<div class="float-left border-r py-1 border-neurolightgrey h-full mr-5 pr-2">
						<div class="text-2xl font-bold text-white">{{moment(post.date).format('DD')}}</div>
						<div class="opacity-50 text-white uppercase">{{moment(post.date).format('MMM')}}</div>
					</div>
					<div class="opacity-70 neuronoir-content" v-html="post.content.html"></div>
				</div>
			</div>
		</Container>
		<Container class="bg-neurodarkgrey" v-if="post.artist">
			<div class="w-full py-12">
				<nuxt-link :to="`/artists/${post.artist.slug}`" class="text-neurolink block pb-12">More about the artist</nuxt-link>
				<PostType :type="post.artist.genre" class="mb-3"></PostType>
				<nuxt-img :alt="post.artist.name" :src="post.artist.profileImage.url" class="lg:float-right w-60 rounded" />
				<h5 class="text-white font-bold text-4xl max-lg:pt-5 uppercase">{{post.artist.name}}</h5>
				<p class="text-white opacity-50 pt-10">{{post.artist.description.markdown}}</p>
				<div class="pt-5">
					<a :href="social.url" class="text-neurolink mr-2" v-for="social in post.artist.links">
						<Icon :name="social.icon" size="22px"/>
					</a>
				</div>
			</div>
		</Container>
	</div>
</template>

<style>
.neuronoir-content a {
	color: #789178 !important;
}
.neuronoir-content p {
	padding-bottom: 10px;
}
</style>
