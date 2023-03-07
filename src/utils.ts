export function removeItemFromArray<T>(array: Array<T>, func: (value: T, index: number, obj: Array<T>) => boolean) {
    const index = array.findIndex(func);
    if (index !== -1) {
        return array.splice(index, 1);
    }
}

export function isStrPositiveInt(str: string) {
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

export function capitalize(value: string) {
    return value.charAt(0).toLocaleUpperCase() + value.slice(1)
}

export async function fetchWithTimeout(url: RequestInfo | URL, options: (RequestInit & { timeout?: number }) = {}) {
    const { timeout = 20_000 } = options;
    let id = -1;
    const controller = new AbortController();
    return Promise.race([
        new Promise((resolve) => {
            id = setTimeout(() => {
                resolve({
                    ok: false,
                    status: 408
                });
                controller.abort();
            }, timeout);
        }),
        fetch(url, {
            ...options,
            signal: controller.signal  
        }).then( res => {
            clearTimeout(id);
            return res;
        })
    ]) as Promise<{ ok: boolean, status: number }>;
  }