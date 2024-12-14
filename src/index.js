import { init } from './js/App.jsx';
import './css/style.css';
import { requestInitialState, useStore } from './js/store.js';
import { sendRequest } from './js/sendRequest.js';
import { getAbortController } from './js/getAbortController.js';
import { prepareList } from './js/components/prepareList.js';

init();

document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'hidden') {
    const { operations, list } = useStore.getState();
    if (Object.values(operations).flat().length) {
      try {
        const res = await sendRequest('batch', { operations }, false);
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
});

console.log('Works!');
