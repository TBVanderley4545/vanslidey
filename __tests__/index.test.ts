import { getCarouselItemWidth, setupCarouselItem } from 'index';
import { generateCarouselItems } from './helpers/document-helpers';
import { mapArrayOfFunctionCalls } from './helpers/general-helpers';

describe('setupCarouselItem()', () => {
  const expectedDataAttribute = 'data-rotation-degree-with-focus';
  let carouselItem: HTMLElement;
  let itemWidth: number;
  let focusIncrement: number;

  beforeEach(() => {
    const numberOfItems = 5;
    const itemIndex = 4;
    focusIncrement = 360 / numberOfItems;
    [carouselItem] = mapArrayOfFunctionCalls<HTMLElement>(generateCarouselItems(1));
    itemWidth = 100 / numberOfItems;

    setupCarouselItem(carouselItem, itemIndex, itemWidth, focusIncrement);
  });

  test('It should set a data attribute called data-rotation-degree-with-focus to the focus increment passed in.', () => {
    // Assert
    expect(carouselItem.hasAttribute(expectedDataAttribute)).toBe(true);
    expect(carouselItem.getAttribute(expectedDataAttribute)).toEqual(focusIncrement);
  });

  test('It should set the item width to the item width passed in.', () => {
    // Assert
    expect(carouselItem.clientWidth).toBeDefined();
    expect(carouselItem.clientWidth).toEqual(itemWidth);
  });
});

describe('getCarouselItemWidth()', () => {
  test('It should return a value equal to to 20 for five carousel items.', () => {
    // Arrange
    const carouselItemCount: number = 5;
    const carouselItemExpectedWidth: number = 20;

    // Act
    const carouselItems = mapArrayOfFunctionCalls<HTMLElement>(generateCarouselItems(carouselItemCount));

    const calculatedCarouselItemWidth = getCarouselItemWidth(carouselItems);

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
