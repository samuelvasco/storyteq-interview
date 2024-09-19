<template>
  <div class="w-full">
    <label :for="inputId" class="sr-only">{{ inputLabel }}</label>
    <input
      :id="inputId"
      :placeholder="placeholder"
      v-model="query"
      @input="onInput"
      @blur="hideResults"
      @keydown.down.prevent="navigateResults(1)"
      @keydown.up.prevent="navigateResults(-1)"
      @keydown.enter.prevent="selectResult(results[selectedIndex])"
      @keydown.esc="hideResults"
      ref="inputField"
      class="border border-gray-300 rounded-md p-2 w-full"
      role="combobox"
      aria-autocomplete="list"
      :aria-expanded="showResults"
      :aria-activedescendant="activeDescendant"
      :aria-owns="listId"
    />
    <div class="absolute w-96 mt-1 z-10 bg-white">
      <ul
        v-if="showResults"
        :id="listId"
        role="listbox"
        class="border border-gray-300 rounded-md max-h-60 overflow-auto"
      >
        <li v-if="results.length === 0" class="p-2">No results found</li>
        <li
          v-for="(result, index) in results"
          :id="`${listId}-option-${index}`"
          :key="index"
          role="option"
          :aria-selected="index === selectedIndex"
          @click="selectResult(result)"
          @mouseenter="selectedIndex = index"
          @keydown.enter="selectResult(result)"
          tabindex="0"
          :class="`p-2 cursor-pointer hover:bg-gray-100 ${
            index === selectedIndex ? 'bg-gray-100' : ''
          }`"
        >
          {{ result }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// Define props
const props = defineProps<{
  inputId: string
  results: string[]
  inputLabel?: string
  placeholder?: string
  shouldFocus?: boolean
}>()

// Define emits
const emit = defineEmits<{
  (e: 'selected', value: string, id: string): void
  (e: 'input', value: string, id: string): void
}>()

// Refs
const query = ref('')
const inputField = ref<HTMLInputElement | null>(null)
const selectedIndex = ref(-1)
const showResults = ref(false)

// Computed
const listId = computed(() => `autocomplete-list-${props.inputId}`)

const activeDescendant = computed(() => {
  return selectedIndex.value >= 0 ? `${listId.value}-option-${selectedIndex.value}` : undefined
})

// Methods
/**
 * Hide results after 200ms
 */
const hideResults = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

/**
 * Handle input change
 */
const onInput = () => {
  selectedIndex.value = -1
  if (query.value.length >= 3) {
    showResults.value = true
    emit('input', query.value, props.inputId)
  } else {
    showResults.value = false
  }
}

/**
 * Select result and emit event
 * @param result - The result to select
 */
const selectResult = (result: string) => {
  query.value = result
  emit('selected', result, props.inputId)
  showResults.value = false
}

/**
 * Navigate results with arrow keys
 * @param direction - The direction to navigate
 */
const navigateResults = (direction: number) => {
  if (showResults.value) {
    selectedIndex.value =
      (selectedIndex.value + direction + props.results.length) % props.results.length
  }
}

// Watch for results changes
watch(props.results, () => {
  selectedIndex.value = -1
})

// Focus on input field when component is mounted
onMounted(() => {
  if (props.shouldFocus) {
    inputField.value?.focus()
  }
})
</script>
