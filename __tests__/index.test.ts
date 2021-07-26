import h from 'hyperscript';
import { extractCarouselComponents, getCarouselItemWidth } from 'index';
import { CarouselComponents } from 'types/carousel-components';
import { generateCarousel, generateCarouselItems } from './helpers/document-helpers';
import { mapArrayOfFunctionCalls } from './helpers/general-helpers';

describe('Test all functions in project.', () => {
  test('getCarouselItemWidth() should return a value equal to to 100 divided by the length of carousel item elements.', () => {
    const carouselItemCount: number = 5;
    const carouselItemExpectedWidth: number = 100 / carouselItemCount;

    // Arrange
    const bodyHTML: Element = generateCarousel(
      mapArrayOfFunctionCalls<Element>(generateCarouselItems(carouselItemCount))
    );

    document.body.append(bodyHTML);

    // Act
    const carouselComponents: CarouselComponents = extractCarouselComponents(
      document.getElementById('carousel-container') || h('div')
    );

    const calculatedCarouselItemWidth = getCarouselItemWidth(carouselComponents.carouselItems);

    // Assert
    expect(calculatedCarouselItemWidth).toBe(carouselItemExpectedWidth);
  });
});
