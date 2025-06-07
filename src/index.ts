import { init } from './ts/App';
import './css/style.css';
import { saveUrgently } from './ts/utils/saveUrgently';

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
// @ts-ignore
let timeout = setTimeout(async function saveItRegularly() {
  await saveUrgently(true);
  timeout = setTimeout(saveItRegularly, timeInterval);
}, timeInterval);

console.log('Works!');
