function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");

  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return { r, g, b };
}

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}

function lightenColor(hex) {
  const percent = 60;
  const { r, g, b } = hexToRgb(hex);

  const newR = Math.min(Math.floor(r + (255 - r) * (percent / 100)), 255);
  const newG = Math.min(Math.floor(g + (255 - g) * (percent / 100)), 255);
  const newB = Math.min(Math.floor(b + (255 - b) * (percent / 100)), 255);

  return rgbToHex(newR, newG, newB);
}

export default lightenColor;
