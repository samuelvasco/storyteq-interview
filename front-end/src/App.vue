<template>
  <div id="app">
    <main>
      <h1 class="text-2xl font-bold">Autocomplete Challenge</h1>
      <section class="flex gap-4">
        <Autocomplete type="cities" placeholder="Search cities..." />
        <Autocomplete type="books" placeholder="Search books..." />
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import Autocomplete from './components/Autocomplete.vue'

export default {
  name: 'App',
  components: {
    Autocomplete
  }
}
</script>
