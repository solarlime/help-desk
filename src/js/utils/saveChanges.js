import { getAbortController } from './getAbortController.js';
import { makeRequest } from './makeRequest.js';
import { prepareList } from './prepareList.js';

/**
 * Makes a request to the server and updates the list state
 * @param {object[]} list - The current list state
 * @param {function} setList - The function to update the list state
 * @returns {Promise<void>} - A promise that resolves when the request is completed
 */
const saveChanges = async (list, setList) => {
  let abortController = getAbortController();
  try {
    const response = await makeRequest(abortController.signal);
    const newList = prepareList(list, response.operations);
    setList(newList);
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
