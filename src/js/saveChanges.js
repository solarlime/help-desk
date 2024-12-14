import { getAbortController } from './getAbortController.js';
import { makeRequest } from './makeRequest.js';
import { prepareList } from './components/prepareList.js';

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
