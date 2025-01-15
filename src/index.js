import { init } from './js/App.jsx';
import './css/style.css';
import { saveUrgently } from './js/utils/saveUrgently.js';

init();

document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'hidden') {
    await saveUrgently();
  }
});

['pagehide, beforeunload'].forEach((event) => {
  document.addEventListener(event, async () => {
    await saveUrgently();
  });
});

const timeInterval = +import.meta.env.DEBOUNCE_TIME * 3;
let timeout = setTimeout(async function saveItRegularly() {
  await saveUrgently(true);
  timeout = setTimeout(saveItRegularly, timeInterval);
}, timeInterval);

console.log('Works!');
