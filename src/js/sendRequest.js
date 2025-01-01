/**
 * Sends a request to the server
 * @param {string} currentAction - the action to perform ('fetch', 'batch')
 * @param {Object} data - the data to be sent (for 'batch' action)
 * @returns {Promise<Object>} - a promise that resolves with the server response ({ status, data })
 */
function sendRequest(currentAction, data = undefined, isAsync = true) {
  return new Promise((resolve, reject) => {
    /**
     * POST sends JSON: { operations: { create: [{ ... }, { ... }], update: [{ ... }, { ... }], delete: [{ ... }, { ... }] } },
     * where { ... } is  { id, done, name, description, date }
     * GET doesn't send any body
     */
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

      xhr.addEventListener('error', (error) => {
        // window.location.replace(import.meta.env.SERVER_DOWN);
        reject(error);
      });

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
