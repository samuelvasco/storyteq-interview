type State = {
  cities: string[]
  books: Book[]
  cityResults: string[]
  bookResults: Book[]
}

type Book = {
  title: string
  author: string
}

export { type State, type Book }
