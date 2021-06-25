export interface TranslationLookup {
  horizontal: number;
  verticalTop: number;
  verticalBottom: number;
}

export interface CarouselComponents {
  carouselContainer: HTMLElement;
  carouselTrack: HTMLElement;
  carouselItems: Array<HTMLElement>;
  carouselIndicators: Array<HTMLElement>;
}
