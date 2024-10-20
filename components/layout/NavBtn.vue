<script lang="ts" setup>
  const isOpen = ref(false)
  const toggleDropdown = () => isOpen.value = !isOpen.value
  const selectItem = () => isOpen.value = false
  const clickOutside = () => isOpen.value === false && (isOpen.value = false)
  onMounted(() => document.addEventListener('click', clickOutside))
</script>

<template>
  <div class="hidden absolute top-8 -translate-y-1/2 right-10 max-sm:block">
    <button @click="toggleDropdown">
      <Icon size="22" name="simple-line-icons:menu" class="text-neurolightgrey hover:text-neurolink" />
    </button>
    <div v-if="isOpen" @click="selectItem" class="block bg-neurodarkgrey fixed right-0 top-0 z-10 p-6">
      <div class="overflow-hidden">
        <button class="float-right">
          <Icon size="22" name="simple-line-icons:close" class="text-neurolightgrey hover:text-neurolink" />
        </button>
      </div>
      <ul class="flex flex-col gap-4">
        <li v-for="({ title, to }, i) in links" :key="i" class="inline-flex text-neurolightgrey">
          <nuxt-link :to="to">{{ title }}</nuxt-link>
        </li>
      </ul>
      <div class="flex gap-4 mt-4">
        <nuxt-link v-for="({ to, target, icon }, i) in extraLinks" :key="i" :target="target" :to="to">
          <Icon size="22px" :name="icon" class="text-neurolightgrey hover:text-neurolink" />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
