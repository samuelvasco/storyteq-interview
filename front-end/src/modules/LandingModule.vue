<template>
  <main class="w-screen h-screen flex flex-col items-center justify-center p-4">
    <article class="flex flex-col gap-4 border border-gray-300 rounded-md p-8">
      <h1 class="text-2xl font-bold">Autocomplete Challenge</h1>
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <autocomplete-input
          inputId="city-input"
          inputLabel="City"
          placeholder="Search cities..."
          shouldFocus
          :results="citiesResult"
          :options="cities"
          @selected="handleSelected"
          @input="handleInput"
        />
        <autocomplete-input
          inputId="book-input"
          inputLabel="Book"
          placeholder="Search books..."
          :results="booksResult"
          :options="books"
          @selected="handleSelected"
          @input="handleInput"
        />
      </section>
    </article>
  </main>
</template>

<script setup lang="ts">
import AutocompleteInput from '@/components/AutocompleteInput.vue'
import { useStore } from 'vuex'
import { StateEntities, type State } from '@/types/store'
import { computed } from 'vue'

// Initialize store
const store = useStore<State>()

// Computed
// These values change when the store is updated
const citiesResult = computed(() => store.state.results[StateEntities.CITY])
const booksResult = computed(() => store.state.results[StateEntities.BOOK])
const cities = computed(() => store.state.entities[StateEntities.CITY])
const books = computed(() => store.state.entities[StateEntities.BOOK])

// Methods
const handleSelected = (result: string) => {
  // TODO: Use the selected result for something
  console.log('selected', result)
}

const handleInput = (query: string, id: string) => {
  const entity = id === 'city-input' ? StateEntities.CITY : StateEntities.BOOK

  // Dispatch search action to the store
  store.dispatch('search', { query, entity })
}
</script>
