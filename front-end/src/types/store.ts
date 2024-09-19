enum StateEntities {
  CITY = 'city',
  BOOK = 'book'
}

type State = {
  entities: Record<StateEntities, string[]>
  results: Record<StateEntities, string[]>
}

type Book = {
  title: string
  author: string
}

export { type State, type Book, StateEntities }
