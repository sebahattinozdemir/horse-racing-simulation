import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HorseList from '../../components/HorseList.vue';
import { createTestingPinia } from '@pinia/testing';

describe('HorseList', () => {
  const mockHorses = [
    { id: 1, name: 'Thunder', condition: 'Good', color: '#FF0000' },
    { id: 2, name: 'Lightning', condition: 'Excellent', color: '#0000FF' }
  ];

  const createWrapper = (initialState = {}) => {
    return mount(HorseList, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              horseRacing: {
                allHorses: mockHorses,
                ...initialState
              }
            }
          })
        ]
      }
    });
  };

  it('renders the component with correct title', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('h2').text()).toBe('Horse List (1-20)');
  });

  it('renders table headers correctly', () => {
    const wrapper = createWrapper();
    const headers = wrapper.findAll('th');
    expect(headers).toHaveLength(3);
    expect(headers[0].text()).toBe('Name');
    expect(headers[1].text()).toBe('Condition');
    expect(headers[2].text()).toBe('Color');
  });

  it('renders horse data correctly', () => {
    const wrapper = createWrapper();
    const rows = wrapper.findAll('tbody tr');
    
    expect(rows).toHaveLength(2);
    
    // Check first horse
    const firstRow = rows[0].findAll('td');
    expect(firstRow[0].text()).toBe('Thunder');
    expect(firstRow[1].text()).toBe('Good');
    
    // Check second horse
    const secondRow = rows[1].findAll('td');
    expect(secondRow[0].text()).toBe('Lightning');
    expect(secondRow[1].text()).toBe('Excellent');
  });

  it('displays color tooltips', () => {
    const wrapper = createWrapper();
    const colorDivs = wrapper.findAll('td div');
    
    expect(colorDivs[0].attributes('title')).toBe('#FF0000');
    expect(colorDivs[1].attributes('title')).toBe('#0000FF');
  });
}); 