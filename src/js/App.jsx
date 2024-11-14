import { createPortal, preconnect } from 'react-dom';
import { useState } from 'react';
import { sendRequest } from './sendRequest.js';
import { ListContainer } from './components/List.jsx';
import { createRoot } from 'react-dom/client';
import { AddButton } from './components/AddButton.jsx';

function App() {
  const plusContainer = document.getElementById('plus-wrapper');
  const [listItems] = useState(
    sendRequest('fetch').then((response) => response.data),
  );

  return (
    <>
      <ListContainer listPromise={listItems} />
      {createPortal(<AddButton />, plusContainer)}
    </>
  );
}

const init = () => {
  const root = document.getElementById('root');
  preconnect(`${import.meta.env.HOST}/help-desk/`);
  createRoot(root).render(<App />);
};

export { init };
