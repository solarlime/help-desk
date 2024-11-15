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
  const [listItems] = useState(
    sendRequest('fetch').then((response) => response.data),
  );
  const [modalType, setModalType] = useState('none');
  console.log(modalType);

  return (
    <>
      <ListContainer listPromise={listItems} setModalType={setModalType} />
      {createPortal(<AddButton setModalType={setModalType} />, plusContainer)}
      {createPortal(
        <ModalWrapper modalType={modalType} setModalType={setModalType} />,
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
