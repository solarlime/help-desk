import { getAbortController } from './getAbortController';
import { makeRequest } from './makeRequest';
import { prepareList } from './prepareList';
import type { IRequest, ITicket } from '../../types/store';

/**
 * Makes a request to the server and updates the list state
 * @returns - A promise that resolves when the request is completed
 */
const saveChanges = async (
  list: Array<ITicket>,
  setList: (list: Array<ITicket>) => void,
) => {
  let abortController: AbortController | null = getAbortController();
  try {
    const response = await makeRequest(abortController.signal);
    if (response) {
      const newList = prepareList(list, (response as IRequest).operations);
      setList(newList);
    }
  } catch (e) {
    if (e === 'Request aborted with a signal') {
      console.info(e);
    } else {
      console.log('List state reverted');
    }
  } finally {
    abortController = null;
  }
};

export { saveChanges };
