<script setup lang="ts">

import Container from "~/components/layout/Container.vue";
import Section from "~/components/layout/Section.vue";

const route = useRoute()
const orderId = route.query.orderId
useHead({
	title: "Neuronoir | Thank You!",
})
</script>

<template>
	<Container class="bg-neurodarkgreyvar">
		<Section title="Thank you!" description="Your order has been processed."></Section>
		<div class="text-white">You will receive by email all the updates related to your order.</div>
		<div class="text-white pb-5"><span class="text-neurolightgrey">Order ID:</span> Neuronoir Order {{orderId}}</div>
	</Container>
</template>
