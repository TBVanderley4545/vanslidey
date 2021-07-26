import h from 'hyperscript';
import { getCarouselItemWidth } from 'index';
import { mapArrayOfFunctionCalls, repeat } from './helpers/general-helpers';

describe('getCarouselItemWidth()', () => {
  test('It should return a value equal to to 20 for five carousel items.', () => {
    // Arrange
    const carouselItemCount: number = 5;
    const carouselItemExpectedWidth: number = 20;

    // Act
    const carouselItems = repeat<() => HTMLElement>(carouselItemCount, () => h('div'));

    const calculatedCarouselItemWidth = getCarouselItemWidth(mapArrayOfFunctionCalls<HTMLElement>(carouselItems));

    // Assert
    expect(calculatedCarouselItemWidth).toBe(carouselItemExpectedWidth);
  });

  test('It should return 0 if the carousel items passed is 0', () => {
    // Arrange
    const carouselItemExpectedWidth: number = 0;
    const emptyCarouselItems: Array<HTMLElement> = [];

    // Act
    const calculatedCarouselItemWidth = getCarouselItemWidth(emptyCarouselItems);

    // Assert
    expect(calculatedCarouselItemWidth).toBe(carouselItemExpectedWidth);
  });
});
