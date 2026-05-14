document.addEventListener("DOMContentLoaded", () => {
  const portraits = Array.from(document.querySelectorAll("img[data-soft-portrait='true']"));

  if (!portraits.length) {
    return;
  }

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const getTargetSize = (img) => {
    const renderedSize = Math.max(img.clientWidth, img.clientHeight, 180);
    const deviceScale = Math.min(window.devicePixelRatio || 1, 1.6);

    return Math.round(Math.min(360, Math.max(220, renderedSize * deviceScale * 0.9)));
  };

  const renderSoftPortrait = (sourceImage, targetSize, focusX, focusY) => {
    const cropSize = Math.min(sourceImage.naturalWidth, sourceImage.naturalHeight);
    const maxX = sourceImage.naturalWidth - cropSize;
    const maxY = sourceImage.naturalHeight - cropSize;
    const sx = clamp((sourceImage.naturalWidth * focusX) - (cropSize / 2), 0, maxX);
    const sy = clamp((sourceImage.naturalHeight * focusY) - (cropSize / 2), 0, maxY);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return null;
    }

    canvas.width = targetSize;
    canvas.height = targetSize;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.filter = "saturate(0.98) contrast(0.97) brightness(1.01)";
    context.drawImage(sourceImage, sx, sy, cropSize, cropSize, 0, 0, targetSize, targetSize);

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const softenPortrait = async (img) => {
    const originalSrc = img.dataset.originalSrc || img.getAttribute("src");
    const focusX = Number(img.dataset.focusX || 50) / 100;
    const focusY = Number(img.dataset.focusY || 42) / 100;
    const targetSize = getTargetSize(img);

    if (!originalSrc || Number(img.dataset.softSize || 0) === targetSize) {
      return;
    }

    img.dataset.originalSrc = originalSrc;

    const sourceImage = new Image();
    sourceImage.src = originalSrc;

    try {
      await sourceImage.decode();
    } catch (error) {
      return;
    }

    const softenedSrc = renderSoftPortrait(sourceImage, targetSize, focusX, focusY);

    if (!softenedSrc) {
      return;
    }

    img.src = softenedSrc;
    img.dataset.softSize = String(targetSize);
  };

  const softenAllPortraits = () => {
    portraits.forEach((img) => {
      void softenPortrait(img);
    });
  };

  if (document.readyState === "complete") {
    softenAllPortraits();
  } else {
    window.addEventListener("load", softenAllPortraits, { once: true });
  }

  let resizeTimer = 0;

  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(softenAllPortraits, 180);
  });
});