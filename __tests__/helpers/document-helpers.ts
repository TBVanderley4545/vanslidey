import h from 'hyperscript';
import { carouselIndicatorClassName, carouselItemClassName, carouselTrackClassName } from 'shared/selectors';
import { mapArrayOfFunctionCalls, repeat } from './general-helpers';

/**
 * Create a specified number of carousel items.
 *
 * @param itemCount The number of items in the carousel.
 * @returns An array of carousel item elements.
 */
export const generateCarouselItems = (itemCount: number): Array<() => Element> =>
  repeat<() => Element>(itemCount, () => h(`div.${carouselItemClassName}`, h('p', 'Carousel item text.')));

/**
 * Create a specified number of carousel indicators.
 *
 * @param carouselItemCount The number of items in the carousel.
 * @returns An array of carousel item indicators.
 */
export const generateCarouselIndicators = (carouselItemCount: number): Array<() => Element> =>
  repeat<() => Element>(carouselItemCount, () => h(`div.${carouselIndicatorClassName}`));

/**
 * Generate a carousel track.
 *
 * @param carouselItems The carousel items to use in the carousel.
 * @returns A carousel track element.
 */
export const generateCarouselTrack = (carouselItems: Array<Element>): Element =>
  h(`div.${carouselTrackClassName}`, carouselItems);

/**
 * Generate a carousel indicator section.
 *
 * @param carouselItemCount The number of items in the carousel.
 * @returns A carousel indicator section.
 */
export const generateCarouselIndicatorSection = (carouselItemCount: number): Element => {
  const carouselIndicators = mapArrayOfFunctionCalls<Element>(generateCarouselIndicators(carouselItemCount));

  return h('div', carouselIndicators);
};

/**
 * Generate a carousel.
 *
 * @param carouselId Id to use for the carousel.
 * @param carouselItems The carousel items to use in the carousel.
 *
 * @returns A complete carousel element.
 */
export const generateCarousel = (carouselId: string, carouselItems: Array<Element>): Element =>
  h(`div#${carouselId}`, generateCarouselTrack(carouselItems), generateCarouselIndicatorSection(carouselItems.length));
