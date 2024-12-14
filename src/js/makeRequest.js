import { formInitialState, requestInitialState, useStore } from './store.js';
import { sendRequest } from './sendRequest.js';

const makeRequest = async (time) => {
  let timeout;
  return async (signal) => {
    try {
      clearTimeout(timeout);
      return new Promise((resolve, reject) => {
        useStore.setState({
          ...useStore.getState(),
          ...formInitialState,
        });
        const abortOperation = () => {
          clearTimeout(timeout);
          signal.removeEventListener('abort', abortOperation);
          reject('Request aborted with a signal');
        };
        signal.addEventListener('abort', abortOperation);
        timeout = setTimeout(async () => {
          const { operations } = useStore.getState();
          if (Object.values(operations).flat().length) {
            const res = await sendRequest('batch', { operations });
            console.log(res);
            useStore.setState({
              ...useStore.getState(),
              ...requestInitialState,
            });
            resolve(res.data);
          }
          signal.removeEventListener('abort', abortOperation);
        }, time);
      });
    } catch (e) {
      alert('A problem with updating! Try to reload this page');
    }
  };
};
const debouncedMakeRequest = await makeRequest(
  import.meta.env.DEBOUNCE_TIME || 10000,
);

export { debouncedMakeRequest as makeRequest };
