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
  let id: NodeJS.Timeout;
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
    json: () => Promise<object>;
  }>;
}

const objectsIdMap = new WeakMap<object, number>();
let objectCount = 0;

export function objectId(object: object) {
  let id = objectsIdMap.get(object);
  if (!id) objectsIdMap.set(object, (id = ++objectCount));
  return id;
}

export function onError(target: HTMLImageElement, url?: string) {
  if (url) {
    target.src = url;
  } else {
    target.removeAttribute('src');
  }
  target.onerror = null;
}

export function setBackground(element: HTMLDivElement, url?: string) {
  if (element.parentElement && url) {
    element.parentElement.style.backgroundImage = `url(${window.baseUrl}/${url})`;
  }
}
