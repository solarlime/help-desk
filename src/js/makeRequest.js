import { formInitialState, requestInitialState, useStore } from './store.js';
import { sendRequest } from './sendRequest.js';

const makeRequest = async (time) => {
  let timeout;
  return async () => {
    try {
      clearTimeout(timeout);
      return new Promise((resolve) => {
        useStore.setState({
          ...useStore.getState(),
          ...formInitialState,
        });
        timeout = setTimeout(async () => {
          const { operations: dataToSend } = useStore.getState();
          console.log(dataToSend);

          const res = await sendRequest('batch', { operations: dataToSend });
          console.log(res);
          useStore.setState({
            ...useStore.getState(),
            ...requestInitialState,
          });
          resolve(res.data);
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
