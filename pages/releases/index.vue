<script setup lang="ts">

import Container from "~/components/layout/Container.vue";
import Section from "~/components/layout/Section.vue";
import moment from 'moment';

const response = await GqlReleases();
const releases = response.releases;

useHead({
	title: `Neuronoir | Releases`,
	meta: [
		{name: 'description', content: 'Here are all the music releases affiliated with neuronoir. Dark and Heavy music made in Romania.'},
		{ name: 'keywords', content: 'music, release, Romania' },
		{ property: 'og:title', content: 'Neuronoir | Releases' },
		{ property: 'og:description', content: 'Here are all the music releases affiliated with neuronoir. Dark and Heavy music made in Romania.' },
		{ property: 'og:url', content: 'https://www.neuronoir.art/releases' },
	]
})
</script>

<template>
<Container class="bg-neurodarkgreyvar py-20">
	<Section
		title="Releases"
		description="Here are all the music releases affiliated with neuronoir."
	/>
	<table class="table-auto w-full">
		<thead class="border-b border-white border-opacity-10 mb-5">
		<tr class="text-white font-light text-opacity-30">
			<td>Title</td>
			<td class="max-sm:hidden">Type</td>
			<td class="max-sm:hidden">Released on</td>
			<td>#</td>
		</tr>
		</thead>
		<tbody>
		<tr v-for="release, i in releases" :key="i">
			<td class="flex my-3">
				<nuxt-img :alt="release.name" :src="release.image.url" class="w-32 max-lg:hidden" />
				<div class="my-auto lg:pl-3">
					<div class="uppercase font-bold text-white">{{release.artist.name}}</div>
					<div class="text-white font-light opacity-50">{{release.name}}</div>
				</div>
			</td>
			<td class="text-white opacity-50 max-sm:hidden">
				{{release.type}}
			</td>
			<td class="text-white opacity-50 max-sm:hidden">
				{{moment(release.date).format('MMM D, YYYY')}}
			</td>
			<td>
				<NuxtLink :to="`/releases/${release.slug}`" class="block text-center bg-neuroprimary font-light px-6 py-2 text-white rounded">
					Learn more
				</NuxtLink>
			</td>
		</tr>
		</tbody>
	</table>
</Container>
</template>
