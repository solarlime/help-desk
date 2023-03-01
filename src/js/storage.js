export default class Storage {
  /**
   * POST отправляет FormData: id, done, name, description, date
   * PUT отправляет FormData: id, done или id, name, description
   * DELETE отправляет FormData: id
   * GET не отправляет ничего в теле запроса
   */
  static request(command, data = '') {
    return new Promise((resolve, reject) => {
      const actions = {
        new: { method: 'POST', url: 'new' },
        update: { method: 'PUT', url: 'update' },
        delete: { method: 'DELETE', url: 'delete' },
        fetch: { method: 'GET', url: 'fetch' },
      };
      const action = actions[command];
      const xhr = new XMLHttpRequest();
      xhr.open(action.method, `${process.env.HOST}/help-desk/${action.url}`);

      xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.response);
        resolve(response);
      });

      xhr.addEventListener('error', (error) => {
        reject(error);
      });

      if (action.method === 'GET') {
        xhr.setRequestHeader('cache-control', 'no-cache');
        xhr.send();
      } else {
        // Заголовок не указываем. Из-за него formidable не парсит содержимое
        // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
        xhr.send(data);
      }
    });
  }
}
