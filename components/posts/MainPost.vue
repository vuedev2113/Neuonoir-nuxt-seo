<script setup lang="ts">
import PostType from "~/components/posts/PostType.vue";
import ReadMore from "~/components/posts/ReadMore.vue";
import moment from 'moment';

const post = defineProps([
	'date',
	'type',
	'title',
	'description',
	'slug',
	'imageUrl'
])
const link = `/posts/${post.slug}`
</script>

<template>
<div class="flex flex-row w-full">
	<div class="border-r py-1 border-neurolightgrey h-full mr-5 pr-2 max-lg:hidden">
		<div class="text-2xl font-bold text-white">{{moment(post.date).format('DD')}}</div>
		<div class="opacity-50 text-white uppercase">{{moment(post.date).format('MMM')}}</div>
	</div>
	<div class="max-lg:hidden">
		<nuxt-link :to="link">
			<nuxt-img width="200" height="200" :alt="post.title" :src="post.imageUrl" class="w-64 pr-5" />
		</nuxt-link>
	</div>
	<div class="my-auto">
		<PostType class="mb-3" :type="post.type"/>
		<nuxt-link :to="link">
			<h3 class="text-4xl font-bold text-white pb-3">{{post.title}}</h3>
		</nuxt-link>
		<h6 class="text-white opacity-50 pb-10">{{post.description}}</h6>
		<ReadMore :link="link" />
	</div>
</div>
</template>
