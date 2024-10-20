<script>
import Container from "~/components/layout/Container.vue";
import Section from "~/components/layout/Section.vue";
import Spinner from "~/components/misc/Spinner.vue";

export default {
	components: { Spinner, Container, Section },
	data() {
		return {
			config: useRuntimeConfig(),
			cartData: [],
			location: "",
			shippingData: null,
			processing: false,
			loading: true,
			error: false,
			offers: [],
			postalShippings: [],
			address: {
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				region: "",
				city: "",
				zip: "",
				address1: ""
			}
		}
	},
	async mounted() {
		if (process.client) {
			const cartStorage = localStorage.getItem("neuronoirCart")
			if (!cartStorage) {
				this.loading = false
				return
			}

			const cartData = JSON.parse(cartStorage)

			this.cartData = await Promise.all(cartData.map(async item => {
				if (item.product.type !== 'T-Shirt') {
					return item
				}

				let response = await fetch(this.config.public.baseURL + "/api/products/" + item.product.productId)
				let backendProduct = await response.json()

				let variant = backendProduct.variants.filter(variant => {
					if (!variant.is_enabled) {
						return false
					}

					const hasVariant = variant.options.filter(option => {
						return option == item.selectedSize.id
					})

					return hasVariant.length > 0
				})

				item.variant = variant[0]
				return item
			}))

			await this.getOffers();

			const response = await GqlGetShippings();
			this.postalShippings = response.shippings;

			this.loading = false
		}

		this.location = await this.getLocation()
		this.shippingData = await this.getShippingData()
	},
	computed: {
		hasPreOrders() {
			let preOrderFound = false;
			this.cartData.forEach(product => {
				product.product.properties.forEach(property => {
					if (property.key.includes("Pre-Order")) {
						preOrderFound = true;
						return;
					}
				})
			})
			return preOrderFound;
		},
		orderPayload() {
			const address = this.address
			address.country = this.location

			return {
				address: this.address,
				lineItems: this.lineItems
			}
		},
		lineItems() {
			if (!this.cartData) {
				return []
			}

			if (!this.cartData.length) {
				return []
			}

			return this.cartData.map(item => {
				if (item.product.type === 'T-Shirt') {
					return {
						productId: item.product.productId,
						variantId: item.variant.id,
						quantity: item.quantity,
						type: item.product.type
					}
				}

				let postalShipping = this.postalShippings.filter(shipping => shipping.countryIso2.toUpperCase() === this.location.toUpperCase())
				let postalShippingCost = parseInt(postalShipping[0].costEuro) * 100
				let selectedSize = "N/A"

				if (item.selectedSize) {
					selectedSize = item.selectedSize.title
				}

				return {
					productId: item.product.productId,
					variantId: null,
					quantity: item.quantity,
					type: item.product.type,
					price: this.getOfferPrice(item.product.productId),
					shipping: postalShippingCost,
					selectedSize: selectedSize
				}
			})
		},
		subTotal() {
			let sum = 0;
			this.cartData.forEach(item => {
				if (item.product.type === 'T-Shirt') {
					sum += item.quantity * Number(item.variant.price)
				} else {
					console.log(item.product)
					sum += item.quantity * this.getOfferPrice(item.product.productId)
				}
			})
			return sum
		},
		shippingCost() {
			if (!this.location && !this.shippingData) {
				return 0
			}

			if (this.shippingData === null) {
				return 0
			}

			let profile = this.shippingData.profiles.filter(profile => {
				return profile.countries.filter(country => country == this.location).length > 0
			})

			if (profile.length > 1) {
				console.log("Multiple profiles found!")
			}

			profile = profile[0]

			let totalQuantity = 0
			let postalShippingItemsCount = 0
			this.cartData.forEach(item => {
				if (item.product.type === 'T-Shirt') {
					totalQuantity += item.quantity
				} else {
					postalShippingItemsCount++
				}
			})

			let firstItem = 0
			let additionalItems = 0
			if (totalQuantity >= 1) {
				firstItem = 1
			}
			additionalItems = totalQuantity - firstItem

			let printifyShippingCost = firstItem * profile.first_item.cost + additionalItems * profile.additional_items.cost
			let manualFulfilmentShippingCost = 0 //TODO:

			if (postalShippingItemsCount >= 1) {
				let postalShipping = this.postalShippings.filter(shipping => shipping.countryIso2.toUpperCase() === this.location.toUpperCase())
				manualFulfilmentShippingCost = parseInt(postalShipping[0].costEuro) * 100
			}

			console.log({ printifyShippingCost, manualFulfilmentShippingCost })

			return printifyShippingCost + manualFulfilmentShippingCost
		}
	},
	methods: {
		getOfferPrice(productId) {
			if (this.offers.length === 0) {
				return 0
			}

			console.log(productId)

			const offers = this.offers.filter(offer => {
				return offer.productId === productId
			})

			if (offers.length === 0) {
				return 0
			}

			return offers[0].price
		},
		async getOffers() {
			const { offers } = await GqlGetOffers();
			this.offers = offers
		},
		async getLocation() {
			const response = await fetch('https://api.ipregistry.co/?key=c6yjeqjieeuzoswy')
			const payload = await response.json()
			return payload.location.country.code
		},
		async getShippingData() {
			const response = await fetch(this.config.public.baseURL + "/api/products/shipping")
			return await response.json()
		},
		async checkout() {
			this.processing = true
			let payload = null

			try {
				const response = await fetch(this.config.public.baseURL + "/api/orders", {
					method: 'POST',
					body: JSON.stringify(this.orderPayload),
					headers: {
						'Content-Type': 'application/json'
					}
				})
				payload = await response.json()
			} catch (e) {
				alert("Something went wrong.")
			}

			if (!payload || !payload.url) {
				alert("Something went wrong.")
				return;
			}

			localStorage.setItem('neuronoirCart', '')
			window.location = payload.url
		}
	}
}
</script>

<template>
	<Container class="bg-neurodarkgreyvar">
		<div class="py-10">
			<Section title="Checkout"
				description="Please add your shipping details so that we are able to process your order." />
			<div v-if="hasPreOrders" class="text-white py-3 mb-5 border-neurolink border rounded px-3">
				You are about to purchase one or multiple items that are currently in Pre-Order. Those will be shipped
				as soon as they are released.
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="sm:col-span-1 col-span-2 order-last sm:order-first">
					<div class="font-semibold text-zinc-100 mb-5 border-b border-zinc-800 pb-3">Shipping Details</div>

					<form @submit.prevent="checkout" id="createOrder"
						class="max-w-screen-md grid sm:grid-cols-2 gap-4 mx-auto">
						<div>
							<label for="first-name" class="inline-block text-neurolightgrey text-sm sm:text-base mb-2">
								First name*
							</label>
							<input name="first-name" v-model="address.firstName" required
								class="w-full bg-gray-50 text-neurolightgrey border focus:ring ring-neuroprimary rounded outline-none transition duration-100 px-3 py-2">
						</div>

						<div>
							<label for="last-name" class="inline-block text-neurolightgrey text-sm sm:text-base mb-2">
								Last name*
							</label>
							<input name="last-name" v-model="address.lastName" required
								class="w-full bg-gray-50 text-neurolightgrey border focus:ring ring-neuroprimary rounded outline-none transition duration-100 px-3 py-2">
						</div>

						<div class="sm:col-span-2">
							<label for="email" class="inline-block text-neurolightgrey text-sm sm:text-base mb-2">
								Email*
							</label>
							<input name="email" v-model="address.email" required type="email"
								class="w-full bg-gray-50 text-neurolightgrey border focus:ring ring-neuroprimary rounded outline-none transition duration-100 px-3 py-2">
						</div>

						<div class="sm:col-span-2">
							<label for="phone" class="inline-block text-neurolightgrey text-sm sm:text-base mb-2">
								Phone number*
							</label>
							<input name="phone" v-model="address.phone" required
								class="w-full bg-gray-50 text-neurolightgrey border focus:ring ring-neuroprimary rounded outline-none transition duration-100 px-3 py-2">
						</div>

						<div>
							<label for="country" class="inline-block text-neurolightgrey text-sm sm:text-base mb-2">
								Country*
							</label>
							<select v-model="location" id="shipping-country" name="country" required
								class="w-full bg-gray-50 text-neurodarkgrey border focus:ring ring-neuroprimary rounded outline-none transition duration-100 px-3 py-2">
								<option value="RO">Romania</option>
								<option value="AL">Albania</option>
								<option value="AD">Andorra</option>
								<option value="AT">Austria</option>
								<option value="BE">Belgium</option>
								<option value="BA">Bosnia and Herzegovina</option>
								<option value="BG">Bulgaria</option>
								<option value="HR">Croatia (Hrvatska)</option>
								<option value="CY">Cyprus</option>
								<option value="CZ">Czech Republic</option>
								<option value="FR">France</option>
								<option value="GI">Gibraltar</option>
								<option value="DE">Germany</option>
								<option value="GR">Greece</option>
								<option value="HU">Hungary</option>
								<option value="IT">Italy</option>
								<option value="LI">Liechtenstein</option>
								<option value="LU">Luxembourg</option>
								<option value="MK">Macedonia</option>
								<option value="MT">Malta</option>
								<option value="MD">Moldova</option>
								<option value="MC">Monaco</option>
								<option value="ME">Montenegro</option>
								<option value="NL">Netherlands</option>
								<option value="PL">Poland</option>
								<option value="PT">Portugal</option>
								<option value="SM">San Marino</option>
								<option value="RS">Serbia</option>
								<option value="SK">Slovakia</option>
								<option value="SI">Slovenia</option>
								<option value="ES">Spain</option>
								<option value="UA">Ukraine</option>
								<option value="GB">United Kingdom</option>
								<option value="DK">Denmark</option>
								<option value="EE">Estonia</option>
								<option value="FO">Faroe Islands</option>
								<option value="FI">Finland</option>
								<option value="GL">Greenland</option>
								<option value="IS">Iceland</option>
								<option value="IE">Ireland</option>
								<option value="LV">Latvia</option>
								<option value="LT">Lithuania</option>
								<option value="NO">Norway</option>
								<option value="SE">Sweden</option>
								<option value="CH">Switzerland</option>
								<option value="TR">Turkey</option>
							</select>
						</div>

						<div>
							<label for="region" class="inline-block text-neurolightgrey text-sm sm:text-base mb-2">
								Region/State*
							</label>
							<input name="region" v-model="address.region" required
								class="w-full bg-gray-50 text-neurolightgrey border focus:ring ring-neuroprimary rounded outline-none transition duration-100 px-3 py-2">
						</div>

						<div>
							<label for="city" class="inline-block text-neurolightgrey text-sm sm:text-base mb-2">
								City*
							</label>
							<input name="city" v-model="address.city" required
								class="w-full bg-gray-50 text-neurolightgrey border focus:ring ring-neuroprimary rounded outline-none transition duration-100 px-3 py-2">
						</div>

						<div>
							<label for="postal-code" class="inline-block text-neurolightgrey text-sm sm:text-base mb-2">
								Postal Code*
							</label>
							<input name="postal-code" v-model="address.zip" required
								class="w-full bg-gray-50 text-neurolightgrey border focus:ring ring-neuroprimary rounded outline-none transition duration-100 px-3 py-2">
						</div>

						<div class="sm:col-span-2">
							<label for="address" class="inline-block text-neurolightgrey text-sm sm:text-base mb-2">
								Address*
							</label>
							<input name="address" v-model="address.address1" required
								class="w-full bg-gray-50 text-neurolightgrey border focus:ring ring-neuroprimary rounded outline-none transition duration-100 px-3 py-2">
						</div>

						<div class="sm:col-span-2 flex justify-between items-center">
							<button v-if="!processing" type="submit"
								class="bg-neuroprimary font-light px-6 py-2 text-white rounded w-full block text-center mt-5">
								Continue to payment
							</button>
							<span v-if="processing" type="submit"
								class="bg-neurodarkgreyvar font-light px-6 py-2 text-white rounded w-full block text-center mt-5">
								Processing ...
							</span>
						</div>
					</form>
				</div>
				<div class="sm:col-span-1 col-span-2">
					<div class="font-semibold text-zinc-100 mb-5 border-b border-zinc-800 pb-3">Order Summary</div>
					<Spinner v-if="loading"></Spinner>
					<div class="flex flex-col gap-4 md:gap-6 mb-6 sm:mb-8" v-for="item in cartData">
						<!-- product - start -->
						<div
							class="flex flex-wrap border border-zinc-700 rounded-lg overflow-hidden gap-x-4 sm:gap-y-4 lg:gap-6">
							<a href="#"
								class="group w-32 sm:w-40 h-32 sm:h-40 block bg-zinc-100 overflow-hidden relative">
								<nuxt-img :src="item.product.image.url" loading="lazy"
									class="w-full h-full object-cover object-center group-hover:scale-110 transition duration-200" />
							</a>

							<div class="flex flex-col justify-between flex-1 py-4">
								<div>
									<a href="#"
										class="inline-block text-white hover:opacity-80 text-lg lg:text-xl font-bold transition duration-100 mb-1">
										{{ item.product.title }}
									</a>

									<h5 v-if="item.product.type === 'T-Shirt'" class="block text-neurolightgrey">Size:
										{{ item.selectedSize.title }}</h5>
									<h6 v-if="item.product.type === 'T Shirt'" class="block text-neurolightgrey">Size:
										{{ item.selectedSize.title }}</h6>
									<span class="block text-neurolightgrey">Qty: {{ item.quantity }}</span>
								</div>
							</div>

							<div
								class="w-full sm:w-auto flex justify-between border-t sm:border-none p-4 sm:pl-0 lg:p-6 lg:pl-0">
								<div class="pt-3 md:pt-2 sm:ml-4 ml-0">
									<span class="block text-zinc-100 md:text-lg font-bold"
										v-if="item.product.type === 'T-Shirt'">
										€{{ (item.quantity * item.variant.price) / 100 }}
									</span>
									<span class="block text-zinc-100 md:text-lg font-bold"
										v-if="item.product.type !== 'T-Shirt'">
										€{{ (item.quantity * getOfferPrice(item.product.productId)) / 100 }}
									</span>
								</div>
							</div>
						</div>
						<!-- product - end -->
					</div>
					<div class="flex flex-col items-end gap-4">
						<div class="float-right pb-10">
							<div class="bg-neurodarkgrey rounded px-3 py-3">
								<div class="flex justify-between">
									<span class="text-white opacity-50 pr-10">Subtotal</span>
									<span class="text-white opacity-50">€{{ (subTotal / 100).toFixed(2) }}</span>
								</div>
								<div class="flex justify-between">
									<span class="text-white opacity-50 pr-10">Shipping in {{ location }}</span>
									<span class="text-white opacity-50">€{{ (shippingCost / 100).toFixed(2) }}</span>
								</div>
								<hr class="block my-5 opacity-10">
								<div class="flex justify-between">
									<span class="text-white font-bold pr-10">Total</span>
									<span class="text-white font-bold">€{{ ((subTotal + shippingCost) /
										100).toFixed(2)}}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Container>
</template>

<style scoped></style>