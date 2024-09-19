# Front-end Challenge

## Requirements

- Node.js v18

## Project setup

In order to run the project, you need to install the dependencies:

```
npm install
```

And then run the development server:

```
npm run dev
```

Tests can be run with:

```
npm run test
```

## Decisions

### Vuex

This project uses Vuex to manage the state of the application. I've created a store with two entities, cities and books, and a results array that contains the results of the search for each entity.

### Vitest

I went with Vitest for the testing framework as it provides seamless integration with Vue 3 and is very fast.

### Composition API

I naturally used the Composition API as it provides a more modern and flexible way to manage the component's state and logic.

### Tailwind CSS

I love tailwind, it makes styling super easy and consistent. When implementing responsiveness I used the `md:`, tailwind class to take into account bigger screens, always taking mobile screens as base size

## To improve

- Add more unit tests
- Add integration tests with something like Playwright or Cypress
- If this is a component library, consider making it framework agnostic. This would work well with a micro-frontends architecture for example
- Consider implementing a layered architecture (Presentation / Domain / Application / Infrastructure) to avoid mixing business logic with UI logic
