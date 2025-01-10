export function capitalize(value: string) {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

export function plural(value: string, count: number) {
  return value + (count > 1 ? 's' : '');
}

export function isDarkColor(hex: string) {
  const c = hex.slice(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const c_r = (rgb >> 16) & 0xff; // extract red
  const c_g = (rgb >> 8) & 0xff; // extract green
  const c_b = (rgb >> 0) & 0xff; // extract blue

  const brightness = c_r * 0.299 + c_g * 0.587 + c_b * 0.114;

  return brightness <= 60;
}
