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
