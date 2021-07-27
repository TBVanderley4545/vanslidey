import { MAX_SCALE, MIN_SCALE } from 'shared/constants';
import { carouselIndicatorClassName, carouselItemClassName, carouselTrackClassName } from 'shared/selectors';
import { CarouselComponents } from 'types/carousel-components';
import { TranslationLookup } from 'types/translation-lookup';

/**
 * Setup each individual carousel item.
 *
 * @param item The carousel item to setup.
 * @param itemIndex The index of the carousel item.
 * @param itemWidth The width of each carousel item.
 * @param focusIncrement The increment of degrees to show focus for.
 */
export const setupCarouselItem = (
  item: HTMLElement,
  itemIndex: number,
  itemWidth: number,
  focusIncrement: number
): void => {
  const itemRef = item;

  itemRef.style.width = `${itemWidth}`;
  itemRef.setAttribute('data-rotation-degree-with-focus', `${itemIndex * focusIncrement}`);
};

/**
 * Get the width of each carousel item with a given array of carousel items.
 *
 * @param carouselItems An array of carousel items.
 * @returns The percentage of each carousel item's width.
 */
export const getCarouselItemWidth = (carouselItems: Array<HTMLElement>): number =>
  carouselItems.length > 0 ? 100 / carouselItems.length : 0;

/**
 * Get the number of degrees between each carousel item.
 *
 * @param carouselItems An array of carousel items.
 * @returns The number of degrees for each focus increment between carousel items.
 */
const getCarouselItemFocusIncrement = (carouselItems: Array<HTMLElement>): number => 360 / carouselItems.length;

/**
 * Set the extreme translations of the carousel container.
 *
 * @param carouselContainer The container to use for the carousel.
 * @param horizontal The extreme horizontal translation limit.
 * @param verticalTop The extreme top vertical translation limit.
 * @param verticalBottom The extreme bottom vertical translation limit.
 */
const setExtremeTranslations = (
  carouselContainer: HTMLElement,
  horizontal: number,
  verticalTop: number,
  verticalBottom: number
): void => {
  carouselContainer.setAttribute('data-extreme-horizontal-translation', `${horizontal}`);
  carouselContainer.setAttribute('data-extreme-vertical-top-translation', `${verticalTop}`);
  carouselContainer.setAttribute('data-extreme-vertical-bottom-translation', `${verticalBottom}`);
};

/**
 * Get the extreme translations of the carousel container.
 *
 * @param carouselContainer The container to use for the carousel.
 */
const getExtremeTranslations = (carouselContainer: HTMLElement): TranslationLookup => ({
  horizontal: +(carouselContainer.dataset.extremeHorizontalTranslation || 0),
  verticalTop: +(carouselContainer.dataset.extremeVerticalTopTranslation || 0),
  verticalBottom: +(carouselContainer.dataset.extremeVerticalBottomTranslation || 0),
});

/**
 * Update the translation lookups on the carousel container.
 *
 * @param carouselComponents The carousel components.
 */
const updateTranslationLookup = (carouselComponents: CarouselComponents): Promise<void> =>
  new Promise<void>(resolve => {
    const { carouselContainer, carouselTrack, carouselItems } = carouselComponents;

    // Get the first non-active carouselItem.
    const referenceCarouselItem = carouselItems[1];

    // Get the extremes of where the carousel items can occupy;
    const extremeHorizontalTranslation =
      carouselContainer.getBoundingClientRect().width / 2 - referenceCarouselItem.getBoundingClientRect().width / 3;
    const extremeVerticalTranslationBottom = carouselTrack.getBoundingClientRect().height / 10;
    const extremeVerticalTranslationTop = -carouselTrack.getBoundingClientRect().height / 5;

    setExtremeTranslations(
      carouselContainer,
      extremeHorizontalTranslation,
      extremeVerticalTranslationTop,
      extremeVerticalTranslationBottom
    );

    resolve();
  });

/**
 * Set the positioning of each carousel item
 *
 * @param carouselComponents The carousel components.
 * @param currentCarouselRotation The number of degrees the carousel is currently rotated.
 */
const updateCarouselItems = (carouselComponents: CarouselComponents, currentCarouselRotation: number): void => {
  const { carouselContainer, carouselItems, carouselIndicators } = carouselComponents;

  carouselItems.forEach(elm => {
    const elmRef = elm;
    let currentRotationPosition;

    if (elm.dataset.rotationDegreeWithFocus !== undefined) {
      currentRotationPosition = currentCarouselRotation + (360 - parseInt(elm.dataset.rotationDegreeWithFocus, 10));
    } else {
      currentRotationPosition = 0;
    }

    const {
      horizontal: extremeHorizontalTranslation,
      verticalTop: extremeVerticalTopTranslation,
      verticalBottom: extremeVerticalBottomTranslation,
    } = getExtremeTranslations(carouselContainer);

    // Get a normalized rotation via the modulus operator.
    const simplifiedRotation = currentRotationPosition % 360;
    const percentageRotated = simplifiedRotation / 360;
    const absValPercentageRotated = Math.abs(percentageRotated);

    let quadrantPercentage = Math.abs((absValPercentageRotated - 0.5) * 4);
    quadrantPercentage = quadrantPercentage > 1 ? Math.abs(quadrantPercentage - 2) : quadrantPercentage;

    const inverter = percentageRotated < 0 ? -1 : 1;

    // Get all translations.
    let currentXTranslation;
    let currentYTranslation;
    let currentScale;
    let currentGrayscale;

    if (absValPercentageRotated >= 0.85 || absValPercentageRotated <= 0.15) {
      elmRef.classList.add(`${carouselItemClassName}--active`);
      elmRef.style.zIndex = '2';
      if (elmRef.dataset.carouselIndex !== undefined) {
        carouselIndicators[parseInt(elmRef.dataset.carouselIndex, 10)].classList.add(
          `${carouselIndicatorClassName}--active`
        );
        carouselIndicators[parseInt(elmRef.dataset.carouselIndex, 10)].style.opacity = '1';
        carouselIndicators[parseInt(elmRef.dataset.carouselIndex, 10)].style.transform = 'scale(1.5)';
      } else {
        carouselIndicators[0].classList.add(`${carouselIndicatorClassName}--active`);
        carouselIndicators[0].style.opacity = '1';
        carouselIndicators[0].style.transform = 'scale(1.5)';
      }
    } else {
      elmRef.classList.remove(`${carouselItemClassName}--active`);
      elmRef.style.zIndex = '';
      if (elmRef.dataset.carouselIndex !== undefined) {
        carouselIndicators[parseInt(elmRef.dataset.carouselIndex, 10)].classList.remove(
          `${carouselIndicatorClassName}--active`
        );
        carouselIndicators[parseInt(elmRef.dataset.carouselIndex, 10)].style.opacity = '';
        carouselIndicators[parseInt(elmRef.dataset.carouselIndex, 10)].style.transform = '';
      } else {
        carouselIndicators[0].classList.remove(`${carouselIndicatorClassName}--active`);
        carouselIndicators[0].style.opacity = '';
        carouselIndicators[0].style.transform = '';
      }
    }

    if (absValPercentageRotated <= 0.25) {
      /*
        X-Axis - moving out to the close side.
        Y-Axis - moving up in the display to the sides
        Scale - shrinking to the sides.
        Grayscale - fading in the gray.
      */
      currentXTranslation = -inverter * extremeHorizontalTranslation * Math.sqrt(quadrantPercentage);
      currentYTranslation =
        extremeVerticalBottomTranslation - extremeVerticalBottomTranslation * 2 * Math.sqrt(quadrantPercentage);
      currentScale = MAX_SCALE - (MAX_SCALE - 1) * Math.sqrt(quadrantPercentage);
      currentGrayscale = 100 * Math.sqrt(quadrantPercentage);
    } else if (absValPercentageRotated > 0.25 && absValPercentageRotated <= 0.5) {
      /*
        X-Axis - moving to the middle.
        Y-Axis - moving up in the display to the middle.
        Scale - shrinking to the middle.
        Grayscale - keeping the gray.
      */
      currentXTranslation = -inverter * extremeHorizontalTranslation * Math.sqrt(quadrantPercentage);
      currentYTranslation =
        extremeVerticalTopTranslation + extremeVerticalBottomTranslation * Math.sqrt(quadrantPercentage);
      currentScale = MIN_SCALE + (1 - MIN_SCALE) * Math.sqrt(quadrantPercentage);
      currentGrayscale = 100;
    } else if (absValPercentageRotated > 0.5 && absValPercentageRotated <= 0.75) {
      /*
        X-Axis - moving out to the far side.
        Y-Axis - moving down in the display to the sides.
        Scale - growing to the sides.
        Grayscale - keeping the gray.
      */
      currentXTranslation = inverter * extremeHorizontalTranslation * Math.sqrt(quadrantPercentage);
      currentYTranslation =
        extremeVerticalBottomTranslation * Math.sqrt(quadrantPercentage) + extremeVerticalTopTranslation;
      currentScale = MIN_SCALE + (1 - MIN_SCALE) * Math.sqrt(quadrantPercentage);
      currentGrayscale = 100;
    } else {
      /*
        X-Axis - moving to the middle.
        Y-Axis - moving down in the display to the middle.
        Scale - growing to the middle.
        Grayscale - fading out the gray.
      */
      currentXTranslation = inverter * extremeHorizontalTranslation * Math.sqrt(quadrantPercentage);
      currentYTranslation =
        -(extremeVerticalBottomTranslation * 2 * Math.sqrt(quadrantPercentage)) + extremeVerticalBottomTranslation;
      currentScale = MAX_SCALE - (MAX_SCALE - 1) * Math.sqrt(quadrantPercentage);
      currentGrayscale = 100 * Math.sqrt(quadrantPercentage);
    }

    // Transform carousel items.
    elmRef.style.transform = `translate3d(${currentXTranslation}px, ${currentYTranslation}px, 0px) scale(${currentScale})`;
    elmRef.style.filter = `grayscale(${currentGrayscale}%)`;
  });
};

/**
 * Setup the VanSlidey carousel.
 *
 * @param carouselComponents The carousel components.
 * @param mobileCheck A function to check if current view is mobile.
 */
const setupCarousel = (carouselComponents: CarouselComponents, mobileCheck: () => boolean): void => {
  const { carouselTrack, carouselItems } = carouselComponents;

  const carouselItemWidth = getCarouselItemWidth(carouselItems);
  const carouselItemFocusIncrement = getCarouselItemFocusIncrement(carouselItems);

  // Initialize the track with no rotation and not rotating.
  carouselTrack.setAttribute('data-carousel-degrees-rotated', '0');
  carouselTrack.setAttribute('data-sliding', 'false');

  // Make the first carousel item the active one.
  carouselItems[0].classList.add(`${carouselItemClassName}--active`);
  carouselItems[0].style.zIndex = '2';

  carouselItems.forEach(elm =>
    setupCarouselItem(elm, carouselItems.indexOf(elm), carouselItemWidth, carouselItemFocusIncrement)
  );

  if (mobileCheck()) {
    updateTranslationLookup(carouselComponents).then(() => {
      updateCarouselItems(carouselComponents, 0);
    });

    // This is a hack because on chrome, the filter distorts the element and makes it look blurry. So, we remove the filter when it's not needed.
    setTimeout(() => {
      carouselItems[0].style.filter = '';
    }, 10);
  }
};

/**
 * Rotate carousel
 *
 * @param carouselComponents The carousel components.
 * @param startX
 * @param endX
 */
const rotateCarousel = (carouselComponents: CarouselComponents, startX: number, endX: number): void => {
  const { carouselTrack } = carouselComponents;

  const carouselWidth = carouselTrack.getBoundingClientRect().width;
  let xDifference = startX - endX;

  // Normalize the amount of rotation, so that we don't mess up the animation.
  if (xDifference > 15) {
    xDifference = 15;
  } else if (xDifference < -15) {
    xDifference = -15;
  } else if (xDifference > 0 && xDifference < 2) {
    xDifference = 2;
  } else if (xDifference < 0 && xDifference > -2) {
    xDifference = -2;
  }

  const xDifferenceAsDegrees = (xDifference * 360) / carouselWidth;

  let currentCarouselRotation;

  if (carouselTrack.dataset.carouselDegreesRotated !== undefined) {
    currentCarouselRotation = parseInt(carouselTrack.dataset.carouselDegreesRotated, 10) + xDifferenceAsDegrees;
  } else {
    currentCarouselRotation = 0;
  }
  carouselTrack.setAttribute('data-carousel-degrees-rotated', `${currentCarouselRotation}`);

  // Calculate each carousel items positioning.
  updateCarouselItems(carouselComponents, currentCarouselRotation);
};

/**
 * Find the closes carousel item.
 *
 * @param  currentRotationPosition The total amount the carousel is currently rotated.
 * @param carouselItems An array of carousel items.
 * @returns The carousel item that is the closest to being active.
 */
const findClosestCarouselItem = (currentRotationPosition: number, carouselItems: Array<HTMLElement>): HTMLElement => {
  // Get current rotation relative to rotation in a circle
  const relativeRotationPosition = Math.abs(currentRotationPosition) % 360;

  let currentClosestDistance = 360;
  let [currentClosestItem] = carouselItems;

  // Find the closest carouselItem to being focused
  carouselItems.forEach(elm => {
    const carouselItem = elm;

    let carouselFocusDegree;

    if (carouselItem.dataset.rotationDegreeWithFocus !== undefined) {
      carouselFocusDegree = parseInt(carouselItem.dataset.rotationDegreeWithFocus, 10);
    } else {
      carouselFocusDegree = 0;
    }

    // Calculate differently if the carousel is negatively rotated vs positively rotated.
    if (currentRotationPosition > 0) {
      // The first item should occupy BOTH 0 and 360 as it's focus position depending on where the circle is in its rotation.
      if (relativeRotationPosition >= 180) {
        if (carouselFocusDegree === 0) {
          carouselFocusDegree = 360;
          carouselItem.setAttribute('data-rotation-degree-with-focus', `${carouselFocusDegree}`);
        }
      } else if (carouselFocusDegree === 360) {
        carouselFocusDegree = 0;
        carouselItem.setAttribute('data-rotation-degree-with-focus', `${carouselFocusDegree}`);
      }
    } else if (currentRotationPosition < 0) {
      // The first item should occupy BOTH 0 and 360 as it's focus position depending on where the circle is in its rotation.
      if (relativeRotationPosition <= 180) {
        if (carouselFocusDegree === 0) {
          carouselFocusDegree = 360;
          carouselItem.setAttribute('data-rotation-degree-with-focus', `${carouselFocusDegree}`);
        }
      } else if (carouselFocusDegree === 360) {
        carouselFocusDegree = 0;
        carouselItem.setAttribute('data-rotation-degree-with-focus', `${carouselFocusDegree}`);
      }
      carouselFocusDegree = 360 - carouselFocusDegree;
    }
    const currentItemDistance = Math.abs(relativeRotationPosition - carouselFocusDegree);
    if (currentItemDistance < currentClosestDistance) {
      currentClosestDistance = currentItemDistance;
      currentClosestItem = carouselItem;
    }
  });

  return currentClosestItem;
};

/**
 * Slide the carousel to the closest item.
 *
 * @param carouselComponents The carousel components.
 */
const slideCarouselToClosestItem = (carouselComponents: CarouselComponents): void => {
  const { carouselTrack, carouselItems } = carouselComponents;

  let currentRotationPosition;

  if (carouselTrack.dataset.carouselDegreesRotated !== undefined) {
    currentRotationPosition = parseInt(carouselTrack.dataset.carouselDegreesRotated, 10);
  } else {
    currentRotationPosition = 0;
  }

  const normalizedRotationPosition = currentRotationPosition % 360;
  const currentClosestItem = findClosestCarouselItem(currentRotationPosition, carouselItems);

  let closestItemsRotationDegree;

  if (currentClosestItem.dataset.rotationDegreeWithFocus !== undefined) {
    closestItemsRotationDegree = parseInt(currentClosestItem.dataset.rotationDegreeWithFocus, 10);
  } else {
    closestItemsRotationDegree = 0;
  }

  // Need to collect inverted values if we're rotation negatively through the carousel.
  if (currentRotationPosition < 0) {
    closestItemsRotationDegree = (360 - closestItemsRotationDegree) * -1;
  }
  // Get the position we should be snapping to and how far that is from current position;
  let snappedRotation;

  if (carouselTrack.dataset.carouselDegreesRotated !== undefined) {
    snappedRotation =
      parseInt(carouselTrack.dataset.carouselDegreesRotated, 10) +
      (closestItemsRotationDegree - normalizedRotationPosition);
  } else {
    snappedRotation = 0;
  }

  // No rotation has occurred, so ensure the first item doesn't get set incorrectly with a value of 360 degrees.
  if (snappedRotation === 0) {
    currentClosestItem.setAttribute('data-rotation-degree-with-focus', '0');
  }

  // Allow an animation to occur for sliding.
  carouselItems.forEach(elm => {
    const carouselItem = elm;

    carouselItem.style.transition = 'transform 150ms ease-in-out, filter 150ms ease-in-out';
  });

  // Set the position to slide to and update the carousel.
  updateCarouselItems(carouselComponents, snappedRotation);
  carouselTrack.setAttribute('data-carousel-degrees-rotated', `${snappedRotation}`);

  // Disable this sliding animation.
  setTimeout(() => {
    carouselItems.forEach(elm => {
      const carouselItem = elm;

      carouselItem.style.transition = '';
    });

    // This is a hack because on chrome, the filter distorts the element and makes it look blurry. So, we remove the filter when it's not needed.
    currentClosestItem.style.filter = '';
  }, 150);
};

/**
 * Start the desktop slide.
 *
 * @param carouselComponents The carousel components.
 * @param mobileCheck A function to check if current view is mobile.
 */
const startDesktopSlide =
  (carouselComponents: CarouselComponents, mobileCheck: () => boolean) =>
  (e: MouseEvent): void => {
    if (mobileCheck()) {
      const { carouselContainer, carouselTrack } = carouselComponents;

      e.preventDefault();

      carouselContainer.setAttribute('data-x-start', `${e.clientX}`);
      carouselTrack.setAttribute('data-sliding', 'true');
    }
  };

/**
 * Perform the desktop slide.
 *
 * @param carouselComponents The carousel components.
 * @param mobileCheck A function to check if current view is mobile.
 */
const desktopSlide =
  (carouselComponents: CarouselComponents, mobileCheck: () => boolean) =>
  (e: MouseEvent): void => {
    const { carouselContainer, carouselTrack } = carouselComponents;

    if (mobileCheck() && carouselTrack.dataset.sliding === 'true') {
      rotateCarousel(carouselComponents, +(carouselContainer.dataset.xStart || 0), e.clientX);

      carouselContainer.setAttribute('data-x-start', `${e.clientX}`);
    }
  };

/**
 * End the slide.
 *
 * @param carouselComponents The carousel components.
 * @param mobileCheck A function to check if current view is mobile.
 */
const endSlide = (carouselComponents: CarouselComponents, mobileCheck: () => boolean) => () => {
  const { carouselContainer, carouselTrack } = carouselComponents;

  if (mobileCheck() && carouselTrack.dataset.sliding === 'true') {
    slideCarouselToClosestItem(carouselComponents);

    carouselContainer.setAttribute('data-x-start', '0');
    carouselTrack.setAttribute('data-sliding', 'false');
  }
};

/**
 * Start the mobile slide.
 *
 * @param carouselComponents The carousel components.
 * @param mobileCheck A function to check if current view is mobile.
 */
const startMobileSlide =
  (carouselComponents: CarouselComponents, mobileCheck: () => boolean) =>
  (e: TouchEvent): void => {
    if (mobileCheck()) {
      const { carouselContainer, carouselTrack } = carouselComponents;

      carouselContainer.setAttribute('data-x-start', `${e.targetTouches[0].clientX}`);
      carouselTrack.setAttribute('data-sliding', 'true');
    }
  };

/**
 * Perform the mobile slide.
 *
 * @param carouselComponents The carousel components.
 * @param mobileCheck A function to check if current view is mobile.
 */
const mobileSlide =
  (carouselComponents: CarouselComponents, mobileCheck: () => boolean) =>
  (e: TouchEvent): void => {
    const { carouselContainer, carouselTrack } = carouselComponents;

    if (mobileCheck() && carouselTrack.dataset.sliding === 'true') {
      rotateCarousel(carouselComponents, +(carouselContainer.dataset.xStart || 0), e.changedTouches[0].clientX);

      carouselContainer.setAttribute('data-x-start', `${e.targetTouches[0].clientX}`);
    }
  };

/**
 * Resize the carousel and update values.
 *
 * @param carouselComponents The carousel components.
 * @param mobileCheck A function to check if current view is mobile.
 */
const resizeCarousel = (carouselComponents: CarouselComponents, mobileCheck: () => boolean) => (): void => {
  const { carouselTrack, carouselItems } = carouselComponents;

  // If the page is mobile, display the carousel, else remove carousel display.
  if (mobileCheck()) {
    updateTranslationLookup(carouselComponents).then(() => {
      if (carouselTrack.dataset.carouselDegreesRotated !== undefined) {
        updateCarouselItems(carouselComponents, parseInt(carouselTrack.dataset.carouselDegreesRotated, 10));
      }
    });
  } else {
    carouselItems.forEach(elm => {
      const carouselItem = elm;
      carouselItem.style.transform = '';
      carouselItem.style.filter = '';
    });
  }
};

/**
 * Enable carousel rotation.
 *
 * @param carouselComponents The carousel components.
 * @param mobileCheck A function to check if current view is mobile.
 */
const enableCarouselRotation = (carouselComponents: CarouselComponents, mobileCheck: () => boolean): void => {
  const { carouselTrack } = carouselComponents;

  // Add the event listeners for mousedown, mousemove, and mouseup
  carouselTrack.addEventListener('mousedown', startDesktopSlide(carouselComponents, mobileCheck));
  carouselTrack.addEventListener('mousemove', desktopSlide(carouselComponents, mobileCheck));
  window.addEventListener('mouseup', endSlide(carouselComponents, mobileCheck));

  // Add the event listeners for touchstart, touchmove, and touchend
  carouselTrack.addEventListener('touchstart', startMobileSlide(carouselComponents, mobileCheck), {
    passive: true,
  });
  carouselTrack.addEventListener('touchmove', mobileSlide(carouselComponents, mobileCheck), {
    passive: true,
  });
  window.addEventListener('touchend', endSlide(carouselComponents, mobileCheck));

  window.addEventListener('resize', resizeCarousel(carouselComponents, mobileCheck));
};

/**
 * Cleanup the carousel.
 *
 * @param carouselComponents The carousel components.
 * @param mobileCheck A function to check if current view is mobile.
 */
const cleanupCarousel = (carouselComponents: CarouselComponents, mobileCheck: () => boolean): void => {
  const { carouselTrack } = carouselComponents;

  // Remove the event listeners for mousedown, mousemove, and mouseup
  carouselTrack.removeEventListener('mousedown', startDesktopSlide(carouselComponents, mobileCheck));
  carouselTrack.removeEventListener('mousemove', desktopSlide(carouselComponents, mobileCheck));
  window.removeEventListener('mouseup', endSlide(carouselComponents, mobileCheck));

  // Remove the event listeners for touchstart, touchmove, and touchend
  carouselTrack.removeEventListener('touchstart', startMobileSlide(carouselComponents, mobileCheck), false);
  carouselTrack.removeEventListener('touchmove', mobileSlide(carouselComponents, mobileCheck), false);
  window.removeEventListener('touchend', endSlide(carouselComponents, mobileCheck));

  window.removeEventListener('resize', resizeCarousel(carouselComponents, mobileCheck));
};

/**
 * Extract relevant carousel components.
 *
 * @param carouselContainer The container to use for the carousel.
 * @returns
 */
export const extractCarouselComponents = (carouselContainer: HTMLElement): CarouselComponents => {
  const [carouselTrackElm] = carouselContainer.getElementsByClassName(
    carouselTrackClassName
  ) as HTMLCollectionOf<HTMLElement>;
  const carouselItemElms = carouselContainer.getElementsByClassName(
    carouselItemClassName
  ) as HTMLCollectionOf<HTMLElement>;
  const carouselIndicatorElms = carouselContainer.getElementsByClassName(
    carouselIndicatorClassName
  ) as HTMLCollectionOf<HTMLElement>;

  const arrayOfCarouselItems = Array.from(carouselItemElms);
  const arrayOfCarouselIndicators = Array.from(carouselIndicatorElms);

  return {
    carouselContainer,
    carouselTrack: carouselTrackElm,
    carouselItems: arrayOfCarouselItems,
    carouselIndicators: arrayOfCarouselIndicators,
  };
};

/**
 * Initialize the carousel.
 *
 * @param carouselContainer The container to use for the carousel.
 * @param mobileCheck A function to check if current view is mobile.
 */
export const initCarousel = (carouselContainer: HTMLElement, mobileCheck: () => boolean): void => {
  const carouselComponents = extractCarouselComponents(carouselContainer);

  setupCarousel(carouselComponents, mobileCheck);
  enableCarouselRotation(carouselComponents, mobileCheck);
};

/**
 * Remove the carousel.
 *
 * @param carouselContainer The container to use for the carousel.
 * @param mobileCheck A function to check if current view is mobile.
 */
export const deinitCarousel = (carouselContainer: HTMLElement, mobileCheck: () => boolean): void => {
  const carouselComponents = extractCarouselComponents(carouselContainer);

  cleanupCarousel(carouselComponents, mobileCheck);
};
