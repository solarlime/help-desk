import { createPortal, preconnect } from 'react-dom';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { sendRequest } from './sendRequest.js';
import { ListContainer } from './components/List.jsx';
import { AddButton } from './components/AddButton.jsx';
import { ModalWrapper } from './components/Modals/ModalWrapper.jsx';

function App() {
  const plusContainer = document.getElementById('plus-wrapper');
  const modalContainer = document.getElementById('modal-wrapper');
  const [listItems] = useState(() => {
    return sendRequest('fetch').then((response) => response.data);
  });
  const [modal, setModal] = useState({ type: 'none', data: null });
  console.log(modal);

  return (
    <>
      <ListContainer listPromise={listItems} setModal={setModal} />
      {createPortal(<AddButton setModal={setModal} />, plusContainer)}
      {createPortal(
        <ModalWrapper modal={modal} setModal={setModal} />,
        modalContainer,
      )}
    </>
  );
}

const init = () => {
  const root = document.getElementById('root');
  preconnect(`${import.meta.env.HOST}/help-desk/`);
  createRoot(root).render(<App />);
};

export { init };
