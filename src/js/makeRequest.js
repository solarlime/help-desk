/**
 * Sends a request to the server
 * @param {string} currentAction - the action to perform ('new', 'update', 'delete', 'fetch')
 * @param {FormData} formData - the data to be sent (for 'new', 'update', 'delete' actions)
 * @returns {Promise<Object>} - a promise that resolves with the server response
 */
export function makeRequest(currentAction, formData = undefined) {
  return new Promise((resolve, reject) => {
    /**
     * POST sends FormData: id, done, name, description, date
     * PUT sends FormData: id, done или id, name, description
     * DELETE sends FormData: id
     * GET doesn't send any body
     */
    const actions = {
      new: { method: 'POST', endpoint: 'new' },
      update: { method: 'PUT', endpoint: 'update' },
      delete: { method: 'DELETE', endpoint: 'delete' },
      fetch: { method: 'GET', endpoint: 'fetch' },
    };
    const { method, endpoint } = actions[currentAction];
    const xhr = new XMLHttpRequest();
    xhr.open(method, `${import.meta.env.HOST}/help-desk/${endpoint}`);

    xhr.addEventListener('load', () => {
      resolve(JSON.parse(xhr.response));
    });

    xhr.addEventListener('error', (error) => {
      window.location.replace(import.meta.env.SERVER_DOWN);
      reject(error);
    });

    if (method === 'GET') {
      xhr.setRequestHeader('Cache-Control', 'no-cache');
      xhr.send();
    } else {
      // Заголовок не указываем. Из-за него formidable не парсит содержимое
      // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(formData);
    }
  });
}
