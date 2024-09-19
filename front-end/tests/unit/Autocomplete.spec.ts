import { shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AutocompleteInput from '../../src/components/AutocompleteInput.vue'
import { describe, it, expect } from 'vitest'

describe('Given the AutocompleteInput component', () => {
  // Default props for the component
  const defaultProps = {
    inputId: 'test-input',
    options: ['Apple', 'Banana', 'Cherry'],
    results: ['Apple', 'Banana', 'Cherry'],
    inputLabel: 'Test Input',
    placeholder: 'Type here',
    shouldFocus: false
  }

  it('Then it renders correctly with default props', () => {
    // Act
    const wrapper = shallowMount(AutocompleteInput, { props: defaultProps })

    // Assert
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('id')).toBe(defaultProps.inputId)
    expect(wrapper.find('input').attributes('placeholder')).toBe(defaultProps.placeholder)
    expect(wrapper.find('label').text()).toBe(defaultProps.inputLabel)
  })

  it('Then it shows results when input has 3 or more characters', async () => {
    // Act
    const wrapper = shallowMount(AutocompleteInput, { props: defaultProps })
    await wrapper.find('input').setValue('App')
    await nextTick()

    // Assert
    expect(wrapper.find('ul').isVisible()).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(3)
  })

  it('Then it hides results when input has less than 3 characters', async () => {
    // Act
    const wrapper = shallowMount(AutocompleteInput, { props: defaultProps })
    await wrapper.find('input').setValue('Ap')
    await nextTick()

    // Assert
    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('Then it emits input event when typing', async () => {
    // Act
    const wrapper = shallowMount(AutocompleteInput, { props: defaultProps })
    await wrapper.find('input').setValue('App')

    // Assert
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')?.[0]).toEqual(['App', 'test-input'])
  })

  it('Then it emits selected event when clicking on a result', async () => {
    // Act
    const wrapper = shallowMount(AutocompleteInput, { props: defaultProps })
    await wrapper.find('input').setValue('App')
    await nextTick()
    await wrapper.find('li').trigger('click')

    // Assert
    expect(wrapper.emitted('selected')).toBeTruthy()
    expect(wrapper.emitted('selected')?.[0]).toEqual(['Apple', 'test-input'])
  })

  it('Then it navigates results with arrow keys', async () => {
    // Act
    const wrapper = shallowMount(AutocompleteInput, { props: defaultProps })
    await wrapper.find('input').setValue('App')
    await nextTick()

    // Assert
    await wrapper.find('input').trigger('keydown.down')
    expect(wrapper.findAll('li')[0].classes()).toContain('bg-gray-100')

    await wrapper.find('input').trigger('keydown.down')
    expect(wrapper.findAll('li')[1].classes()).toContain('bg-gray-100')

    await wrapper.find('input').trigger('keydown.up')
    expect(wrapper.findAll('li')[0].classes()).toContain('bg-gray-100')
  })

  it('Then it selects result with enter key', async () => {
    // Act
    const wrapper = shallowMount(AutocompleteInput, { props: defaultProps })
    await wrapper.find('input').setValue('App')
    await nextTick()

    await wrapper.find('input').trigger('keydown.down')
    await wrapper.find('input').trigger('keydown.enter')

    expect(wrapper.emitted('selected')).toBeTruthy()
    expect(wrapper.emitted('selected')?.[0]).toEqual(['Apple', 'test-input'])
  })

  it('Then it hides results on blur', async () => {
    // Act
    const wrapper = shallowMount(AutocompleteInput, { props: defaultProps })
    await wrapper.find('input').setValue('App')
    await nextTick()

    expect(wrapper.find('ul').isVisible()).toBe(true)
    await wrapper.find('input').trigger('blur')

    // Wait for the 200ms timeout
    await new Promise((resolve) => setTimeout(resolve, 250))

    // Assert

    expect(wrapper.find('ul').exists()).toBe(false)
  })

  it('Then it sets correct ARIA attributes', async () => {
    // Act
    const wrapper = shallowMount(AutocompleteInput, { props: defaultProps })
    const input = wrapper.find('input')

    // Assert
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-autocomplete')).toBe('list')

    await wrapper.find('input').setValue('App')
    await nextTick()

    expect(input.attributes('aria-expanded')).toBe('true')
    expect(input.attributes('aria-owns')).toBe('autocomplete-list-test-input')

    await wrapper.find('input').trigger('keydown.down')
    expect(input.attributes('aria-activedescendant')).toBe('autocomplete-list-test-input-option-0')
  })
})
