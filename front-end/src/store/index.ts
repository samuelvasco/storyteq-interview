import type { Book, State } from '@/types/store'
import { createStore } from 'vuex'
import type { ActionContext } from 'vuex/types/index.js'

const cities = [
  'san jose',
  'santiago',
  'san francisco',
  'santa rosa',
  'san juan',
  'sabadell',
  'salamanca',
  'salt lake city',
  'salinas',
  'salem',
  'sausalito',
  'taipei',
  'tel aviv',
  'tempe',
  'termez',
  'temuco',
  'tiajuna',
  'tieling',
  'thousand oaks',
  'thunder bay',
  'tokyo',
  'tulsa'
]

const books = [
  { title: 'Don Quixote', author: 'Miguel De Cervantes' },
  { title: "Pilgrim's Progress", author: 'John Bunyan' },
  { title: 'Robinson Crusoe', author: 'Daniel Defoe' },
  { title: "Gulliver's Travels", author: 'Jonathan Swift' },
  { title: 'Tom Jones', author: 'Henry Fielding' },
  { title: 'Clarissa', author: 'Samuel Richardson' },
  { title: 'Tristram Shandy', author: 'Laurence Sterne' }
]

export default createStore<State>({
  state: {
    cities,
    books,
    cityResults: [],
    bookResults: []
  },
  mutations: {
    setCityResults(state: State, results: string[]) {
      state.cityResults = results
    },
    setBookResults(state: State, results: Book[]) {
      state.bookResults = results
    }
  },
  actions: {
    searchCities({ commit, state }: ActionContext<State, State>, query: string) {
      if (query.length < 3) {
        commit('setCityResults', [])
        return
      }
      const results = state.cities.filter((city) =>
        city.toLowerCase().includes(query.toLowerCase())
      )
      commit('setCityResults', results)
    },
    searchBooks({ commit, state }: ActionContext<State, State>, query: string) {
      if (query.length < 3) {
        commit('setBookResults', [])
        return
      }
      const results = state.books.filter((book: { title: string }) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      )
      commit('setBookResults', results)
    }
  }
})
