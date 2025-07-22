import { JSX } from 'solid-js/jsx-runtime';

import { baseUrl } from './config';

export function removeItemFromArray<T>(
  array: T[],
  func: (value: T, index: number, obj: T[]) => boolean,
) {
  const index = array.findIndex(func);
  if (index !== -1) {
    return array.splice(index, 1);
  }
}

const objectsIdMap = new Map<object, number>();
let objectCount = 0;

export function objectId(object: object) {
  let id = objectsIdMap.get(object);
  if (!id) objectsIdMap.set(object, (id = ++objectCount));
  return id;
}

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

export function setParentBackground(element: HTMLDivElement, url?: string) {
  if (url && element.parentElement) {
    element.parentElement.style.backgroundImage = `url(${baseUrl}/${url})`;
  }
}

export function querySelector(
  element: HTMLElement | Document,
  selector: string,
) {
  return element.querySelector<HTMLElement>(selector);
}
