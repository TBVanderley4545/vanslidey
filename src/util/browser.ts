const isVisible = (elem: HTMLElement): boolean => {
  return elem !== null ? !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length) : false;
};

export const isPageMobile = (): boolean => {
  const mobileSyncPixel = document.getElementById('mobile-sync-pixel');

  return mobileSyncPixel !== null ? isVisible(mobileSyncPixel) : false;
};
