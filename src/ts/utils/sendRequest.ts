import type { IRequest } from '../../types/store';
import type { TResponse, TActions } from '../../types/request';

/**
 * Performs a request to the server.
 *
 * @param currentAction - The action to perform. Currently, only 'batch' and 'fetch' are supported.
 * @param data - The data to send with the request. It is required for 'batch' action and should be
 * in the format of { operations: { create: [{ ... }, { ... }], update: [{ ... }, { ... }], delete: [{ ... }, { ... }] } },
 * where { ... } is  { id, done, name, description, date }.
 * @param isAsync - Whether to perform an async request. If false, a synchronous request is made.
 * @returns A promise that resolves with the server response data in JSON format ({ status, data }).
 */
function sendRequest(
  currentAction: TActions,
  data?: IRequest,
  isAsync: boolean = true,
): Promise<TResponse> {
  return new Promise((resolve, reject) => {
    let timeout: NodeJS.Timeout;
    const actions = {
      batch: { method: 'POST', endpoint: 'batch' },
      fetch: { method: 'GET', endpoint: 'fetch' },
    };
    const { method, endpoint } = actions[currentAction];
    if (
      !isAsync &&
      method === 'POST' &&
      'keepalive' in new Request('file:///')
    ) {
      // Fetch with 'keepalive' is used for requests when the tab is hidden. For iOS 12 a synchronous XHR is left
      fetch(`${import.meta.env.HOST}/help-desk/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(data),
        keepalive: true,
      })
        .then((res) => res.json())
        .then((res) => resolve(res))
        .catch((error) => reject(error));
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open(
        method,
        `${import.meta.env.HOST}/help-desk/${endpoint}`,
        isAsync,
      );
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

      xhr.addEventListener('load', () => {
        resolve(JSON.parse(xhr.response));
      });

      ['error', 'abort'].forEach((event) =>
        xhr.addEventListener(event, (error) => {
          timeout = setTimeout(() => {
            clearTimeout(timeout);
            window.location.replace(import.meta.env.SERVER_DOWN);
          }, 1000);
          reject(error);
        }),
      );

      timeout = setTimeout(() => {
        clearTimeout(timeout);
        xhr.abort();
      }, 5000);

      if (method === 'GET') {
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.send();
      } else {
        xhr.send(JSON.stringify(data));
      }
    }
  });
}

export { sendRequest };
