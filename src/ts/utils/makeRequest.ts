import { formInitialState, requestInitialState, useStore } from '../store';
import { sendRequest } from './sendRequest';
import type { IRequest, ITicket } from '../../types/store';

/**
 * Creates a debounced request function that performs a batch operation.
 *
 * @param time - The debounce time in milliseconds before the request is sent.
 * @returns - Returns an async function that takes an AbortSignal as an argument
 * and returns a promise resolving with the server response data.
 *
 * The returned function updates the store's state with initial form data and sets a timeout
 * to perform a batch operation using the current operations in the store. If the signal is
 * aborted, the operation is cancelled and the promise is rejected. Upon successful completion,
 * the store's state changes to the initial request state with the server response data.
 *
 */
const makeRequest = async (time: number) => {
  let timeout: NodeJS.Timeout;
  return async (signal: AbortSignal) => {
    try {
      clearTimeout(timeout);
      return new Promise<IRequest | Array<ITicket>>((resolve, reject) => {
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
  +import.meta.env.DEBOUNCE_TIME || 10000,
);

export { debouncedMakeRequest as makeRequest };
