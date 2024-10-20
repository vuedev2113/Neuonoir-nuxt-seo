<script setup lang="ts">

import Container from "~/components/layout/Container.vue";
import Section from "~/components/layout/Section.vue";

const res = await GqlArtists()
const artists = res.artists

useHead({
	title: "Neuronoir | Artists",
	meta: [
		{
			name: 'description',
			content: 'Here are the bands and projects affiliated with neuronoir. Dark and Heavy music made in Romania.'
		},
		{ name: 'keywords', content: 'music, artist, artist, Romania' },
		{ property: 'og:title', content: 'Neuronoir | Artists' },
		{ property: 'og:description', content: 'Here are the bands and projects affiliated with neuronoir. Dark and Heavy music made in Romania.' },
		{ property: 'og:url', content: 'https://www.neuronoir.art/artists' },
	]
})
</script>

<template>
	<Container class="bg-neurodarkgreyvar">
		<Section description="Here are the bands and projects affiliated with neuronoir." title="Artists" />
		<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 py-10 pb-24">
			<nuxt-link v-for="artist, i in artists" :to="`/artists/${artist.slug}`"
				class="rounded-lg bg-cover max-h-30 block"
				:key="i"
				:style="`background-image:linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${artist.previewImage.url})`">
				<div class="pt-32 pb-3 px-3">
					<h3 class="text-white font-bold uppercase text-lg">{{ artist.name }}</h3>
					<h5 class="text-neurolightgrey font-light">{{ artist.genre }}</h5>
				</div>
			</nuxt-link>
		</div>
	</Container>
</template>
