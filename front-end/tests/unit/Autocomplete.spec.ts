import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import Autocomplete from '@/components/Autocomplete.vue'

describe('Autocomplete.vue', () => {
  const store = createStore({
    state: {
      cityResults: [],
      bookResults: []
    },
    actions: {
      searchCities: jest.fn(),
      searchBooks: jest.fn()
    }
  })

  it('renders placeholder text correctly', () => {
    const wrapper = mount(Autocomplete, {
      props: {
        type: 'cities',
        placeholder: 'Search cities...'
      },
      global: {
        plugins: [store]
      }
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search cities...')
  })

  it('shows "Type at least 3 characters" message when query length is less than 3', async () => {
    const wrapper = mount(Autocomplete, {
      props: {
        type: 'cities'
      },
      global: {
        plugins: [store]
      }
    })
    await wrapper.find('input').setValue('ab')
    expect(wrapper.text()).toContain('Type at least 3 characters')
  })

  it('shows "No results found" when query length is 3 or more and no results', async () => {
    const wrapper = mount(Autocomplete, {
      props: {
        type: 'cities'
      },
      global: {
        plugins: [store]
      }
    })
    await wrapper.find('input').setValue('abc')
    expect(wrapper.text()).toContain('No results found')
  })
})
