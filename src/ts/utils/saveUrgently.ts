import { requestInitialState, useStore } from '../store';
import { sendRequest } from './sendRequest';
import { getAbortController } from './getAbortController';
import { prepareList } from './prepareList';
import type { IRequest } from '../../types/store';

/**
 * Saves the current state of operations to the server without debouncing.
 *
 * If there are any operations to be processed, this function sends a batch request to the server.
 * Upon success, it resets the store state to the initial request state and updates the list with
 * the server response. If an error occurs during the request, it logs the error and reverts
 * any list state changes.
 *
 * @param - Determines if the request should be sent asynchronously.
 */
async function saveUrgently(async = false) {
  const { operations, list } = useStore.getState();
  if (Object.values(operations).flat().length) {
    try {
      const res = await sendRequest('batch', { operations }, async);
      getAbortController().abort();
      useStore.setState({
        ...useStore.getState(),
        ...requestInitialState,
      });
      const newList = prepareList(list, (res.data as IRequest).operations);
      useStore.setState({
        ...useStore.getState(),
        list: newList,
      });
    } catch (e) {
      console.log(e);
      console.log('List state reverted');
    }
  }
}

export { saveUrgently };
