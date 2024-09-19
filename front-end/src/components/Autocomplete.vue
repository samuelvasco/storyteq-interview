<template>
  <div class="w-96">
    <label :for="inputId" class="sr-only">{{ placeholder }}</label>
    <input
      :id="inputId"
      :placeholder="placeholder"
      v-model="query"
      @input="onInput"
      ref="inputField"
      class="border border-gray-300 rounded-md p-2 w-full"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="showResults"
      :aria-owns="listId"
    />
    <div class="absolute">
      <ul
        v-if="showResults"
        :id="listId"
        role="listbox"
        class="border border-gray-300 rounded-md max-h-60 overflow-auto"
      >
        <li v-if="results.length === 0">No results found</li>
        <li
          v-for="(result, index) in results"
          :key="index"
          role="option"
          :aria-selected="index === selectedIndex"
          @click="selectResult(result)"
          @keydown.enter="selectResult(result)"
          tabindex="0"
          class="p-2 cursor-pointer hover:bg-gray-100"
        >
          {{ displayResult(result) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import type { State, Book } from '@/types/store'

type AutocompleteType = 'cities' | 'books'

const props = defineProps<{
  type: AutocompleteType
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'selected', value: string | Book): void
}>()

const store = useStore<State>()
const query = ref('')
const inputField = ref<HTMLInputElement | null>(null)
const selectedIndex = ref(-1)
const inputId = computed(() => `autocomplete-${props.type}`)
const listId = computed(() => `autocomplete-list-${props.type}`)

const results = computed(() =>
  props.type === 'cities' ? store.state.cityResults : store.state.bookResults
)

const showResults = computed(() => query.value.length >= 3)

const onInput = () => {
  selectedIndex.value = -1
  if (query.value.length >= 3) {
    store.dispatch(`search${props.type.charAt(0).toUpperCase() + props.type.slice(1)}`, query.value)
  }
}

const displayResult = (result: string | Book) => {
  if (typeof result === 'string') {
    return result
  }
  return `${result.title} by ${result.author}`
}

const selectResult = (result: string | Book) => {
  query.value = typeof result === 'string' ? result : result.title
  emit('selected', result)
}

watch(results, () => {
  selectedIndex.value = -1
})

onMounted(() => {
  inputField.value?.focus()
})
</script>
