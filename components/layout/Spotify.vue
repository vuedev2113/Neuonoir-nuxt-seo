<script setup lang="ts">
import Container from '~/components/layout/Container.vue'
</script>

<template>
	<Container class="bg-neuroprimary py-12">
		<div class="flex flex-row overflow-hidden">
			<div class="mr-auto rotate-12 my-auto max-md:hidden">
				<Icon size="250px" name="iconoir:spotify" class="text-white" />
			</div>
			<div class="my-auto text-right">
				<h3 class="text-3xl font-bold text-white uppercase">Spotify</h3>
				<h5 class="text-white opacity-50 pb-24">Check out our releases through our Spotify playlist.</h5>
				<a href="https://open.spotify.com/playlist/0Qglq89U99VmMzYc0MY7RF" target="_blank"
					class="px-10 py-3 bg-neurolight inline-block text-neurodarkgrey opacity-70 rounded">
					Spotify playlist
				</a>
			</div>
		</div>
	</Container>
</template>
