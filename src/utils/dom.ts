import { JSX } from 'solid-js/jsx-runtime';

export function onImageError(
  url?: string,
): JSX.EventHandler<HTMLImageElement, ErrorEvent> {
  return ({ currentTarget: target }) => {
    if (url && !target.src?.includes(url)) {
      target.src = url;
    } else {
      target.removeAttribute('src');
    }
  };
}

export function querySelector(
  element: HTMLElement | Document,
  selector: string,
) {
  return element.querySelector<HTMLElement>(selector);
}
