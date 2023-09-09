/* */

export function removeItemFromArray<T>(
  array: T[],
  func: (value: T, index: number, obj: T[]) => boolean
) {
  const index = array.findIndex(func);
  if (index !== -1) {
    return array.splice(index, 1);
  }
}

export function isStrPositiveInt(str: string) {
  return /^\+?(0|[1-9]\d*)$/.test(str);
}

export function capitalize(value: string) {
  return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

export async function fetchWithTimeout(
  url: RequestInfo | URL,
  options: RequestInit & { timeout?: number } = {}
) {
  const { timeout = 10000 } = options;
  let id = -1;
  const controller = new AbortController();
  return Promise.race([
    new Promise((resolve) => {
      id = setTimeout(() => {
        controller.abort();
        resolve({
          ok: false,
          status: 408,
        });
      }, timeout);
    }),
    fetch(url, {
      ...options,
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(id);
        return res;
      })
      .catch(() => {
        clearTimeout(id);
        return {
          ok: false,
          status: 408,
        };
      }),
  ]) as Promise<{
    ok: boolean;
    status: number;
    text: () => Promise<string>;
    json: () => Promise<Object>;
  }>;
}

export function nestedKey(
  obj: Record<string, any>,
  keys: string | string[]
): any {
  if (!Array.isArray(keys) && !keys.includes('.')) {
    return obj[keys];
  }

  const keyList = Array.isArray(keys) ? keys : keys.split('.');
  const nestedObj = obj[keyList.shift()!];

  if (keyList.length) {
    return nestedKey(nestedObj, keyList);
  }

  return nestedObj;
}

const objectsIdMap = new WeakMap();
let objectCount = 0;

export function objectId(object: Record<string, unknown>) {
  if (!objectsIdMap.has(object)) objectsIdMap.set(object, ++objectCount);
  return objectsIdMap.get(object);
}

export function onError(this: any, target: HTMLImageElement, url: string) {
  target.src = url;
  target.onerror = null;
}

export function setBackground(element: HTMLDivElement, url: string) {
  if (element.parentElement) {
    element.parentElement.style.backgroundImage = `url(${window.baseUrl}/${url})`;
  }
}
