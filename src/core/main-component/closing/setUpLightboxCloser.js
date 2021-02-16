export function setUpLightboxCloser({
  core: { lightboxCloser: self, lightboxCloseActioner, fullscreenToggler },
  componentsServices: {
    toolbarButtons: { fullscreen: isFullscreenOpenState },
  },
}) {
  self.closeLightbox = () => {
    if (!lightboxCloseActioner.isLightboxFadingOut) {
      lightboxCloseActioner.runActions();
      if (isFullscreenOpenState.get()) {
        fullscreenToggler.exitFullscreen();
      }
    }
  };
}
