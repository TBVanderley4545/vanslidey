import h from 'hyperscript';
import {
  getCarouselItemFocusIncrement,
  getCarouselItemWidth,
  getExtremeTranslations,
  setExtremeTranslations,
  setupCarouselItem,
} from 'vanslidey';
import { generateCarouselItems } from './helpers/document-helpers';
import { mapArrayOfFunctionCalls } from './helpers/general-helpers';

describe('setupCarouselItem()', () => {
  const expectedDataAttribute = 'data-rotation-degree-with-focus';
  let carouselItem: HTMLElement;
  let itemIndex: number;
  let focusIncrement: number;

  beforeEach(() => {
    const numberOfItems = 5;
    itemIndex = 4;
    focusIncrement = 360 / numberOfItems;
    [carouselItem] = mapArrayOfFunctionCalls<HTMLElement>(generateCarouselItems(1));

    setupCarouselItem(carouselItem, itemIndex, focusIncrement);
  });

  test('It should set a data attribute called data-rotation-degree-with-focus to the focus increment passed in times the index.', () => {
    // Assert
    expect(carouselItem.hasAttribute(expectedDataAttribute)).toBe(true);
    expect(carouselItem.getAttribute(expectedDataAttribute)).toEqual(`${focusIncrement * itemIndex}`);
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

  test('It should return 0 if the array of carousel items passed is contains no items.', () => {
    // Arrange
    const carouselItemExpectedWidth: number = 0;
    const emptyCarouselItems: Array<HTMLElement> = [];

    // Act
    const calculatedCarouselItemWidth = getCarouselItemWidth(emptyCarouselItems);

    // Assert
    expect(calculatedCarouselItemWidth).toBe(carouselItemExpectedWidth);
  });
});

describe('getCarouselItemFocusIncrement()', () => {
  test('It should return a value equal to 90 for 4 carousel items.', () => {
    // Arrange
    const carouselItemCount: number = 4;
    const expectedFocusIncrement: number = 90;

    // Act
    const carouselItems = mapArrayOfFunctionCalls<HTMLElement>(generateCarouselItems(carouselItemCount));

    const focusIncrement = getCarouselItemFocusIncrement(carouselItems);

    // Assert
    expect(focusIncrement).toBe(expectedFocusIncrement);
  });

  test('It should return 0 if the array of carousel items passed is contains no items.', () => {
    // Arrange
    const carouselItemExpectedWidth: number = 0;
    const emptyCarouselItems: Array<HTMLElement> = [];

    // Act
    const calculatedCarouselItemWidth = getCarouselItemFocusIncrement(emptyCarouselItems);

    // Assert
    expect(calculatedCarouselItemWidth).toBe(carouselItemExpectedWidth);
  });
});

describe('setExtremeTranslations()', () => {
  let carouselContainer: HTMLElement;
  const horizontal = 200;
  const verticalTop = 30;
  const verticalBottom = 20;

  beforeEach(() => {
    carouselContainer = h('div');
    setExtremeTranslations(carouselContainer, horizontal, verticalTop, verticalBottom);
  });

  test('It should set a data attribute called data-extreme-horizontal-translation to the value passed in.', () => {
    // Arrange
    const testedAttribute = 'data-extreme-horizontal-translation';

    // Assert
    expect(carouselContainer.hasAttribute(testedAttribute)).toBe(true);
    expect(carouselContainer.getAttribute(testedAttribute)).toEqual(`${horizontal}`);
  });

  test('It should set a data attribute called data-extreme-vertical-top-translation to the value passed in.', () => {
    // Arrange
    const testedAttribute = 'data-extreme-vertical-top-translation';

    // Assert
    expect(carouselContainer.hasAttribute(testedAttribute)).toBe(true);
    expect(carouselContainer.getAttribute(testedAttribute)).toEqual(`${verticalTop}`);
  });

  test('It should set a data attribute called data-extreme-vertical-bottom-translation to the value passed in.', () => {
    // Arrange
    const testedAttribute = 'data-extreme-vertical-bottom-translation';

    // Assert
    expect(carouselContainer.hasAttribute(testedAttribute)).toBe(true);
    expect(carouselContainer.getAttribute(testedAttribute)).toEqual(`${verticalBottom}`);
  });
});

describe('getExtremeTranslations()', () => {
  let carouselContainer: HTMLElement;
  let carouselContainerWithoutAttributes: HTMLElement;

  beforeEach(() => {
    carouselContainer = h('div', {
      'data-extreme-horizontal-translation': 100,
      'data-extreme-vertical-top-translation': 100,
      'data-extreme-vertical-bottom-translation': 100,
    });

    carouselContainerWithoutAttributes = h('div');
  });

  test('It should return 0 if data-extreme-horizontal-translation is not set on the element.', () => {
    // Act
    const horizontalTranslation = getExtremeTranslations(carouselContainerWithoutAttributes).horizontal;

    // Assert
    expect(horizontalTranslation).toBe(0);
  });

  test('It should return 0 if data-extreme-vertical-top-translation is not set on the element.', () => {
    // Act
    const verticalTopTranslation = getExtremeTranslations(carouselContainerWithoutAttributes).verticalTop;

    // Assert
    expect(verticalTopTranslation).toBe(0);
  });

  test('It should return 0 if data-extreme-vertical-bottom-translation is not set on the element.', () => {
    // Act
    const verticalBottomTranslation = getExtremeTranslations(carouselContainerWithoutAttributes).verticalBottom;

    // Assert
    expect(verticalBottomTranslation).toBe(0);
  });

  test('It should return the value of data-extreme-horizontal-translation if it exists on the element', () => {
    // Act
    const horizontalTranslation = getExtremeTranslations(carouselContainer).horizontal;

    // Assert
    expect(horizontalTranslation).toBe(100);
  });

  test('It should return the value of data-extreme-vertical-top-translation if it exists on the element', () => {
    // Act
    const verticalTopTranslation = getExtremeTranslations(carouselContainer).verticalTop;

    // Assert
    expect(verticalTopTranslation).toBe(100);
  });

  test('It should return the value of data-extreme-vertical-bottom-translation if it exists on the element', () => {
    // Act
    const verticalBottomTranslation = getExtremeTranslations(carouselContainer).verticalBottom;

    // Assert
    expect(verticalBottomTranslation).toBe(100);
  });
});
