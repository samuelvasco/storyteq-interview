import type { State, StateEntities } from '@/types/store'
import { createStore } from 'vuex'
import type { ActionContext } from 'vuex'
import books from '@/data/books.json'
import cities from '@/data/cities.json'

export default createStore<State>({
  state: {
    entities: {
      city: cities,
      book: books.map((book) => book.title)
    },
    results: {
      city: [],
      book: []
    }
  },
  mutations: {
    setResults(state: State, { results, entity }: { results: string[]; entity: StateEntities }) {
      state.results[entity] = results
    }
  },
  actions: {
    search(
      { commit, state }: ActionContext<State, State>,
      { query, entity }: { query: string; entity: StateEntities }
    ) {
      const results = state.entities[entity].filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      )
      commit('setResults', { results, entity })
    }
  }
})
