import { requestInitialState, useStore } from './store.js';
import { sendRequest } from './sendRequest.js';
import { getAbortController } from './getAbortController.js';
import { prepareList } from './components/prepareList.js';

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
      const newList = prepareList(list, res.data.operations);
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
