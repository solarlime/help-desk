import { createPortal, preconnect } from 'react-dom';
import { useState, useOptimistic } from 'react';
import { createRoot } from 'react-dom/client';
import { sendRequest } from './sendRequest.js';
import { ListContainer } from './components/List.jsx';
import { AddButton } from './components/AddButton.jsx';
import { ModalWrapper } from './components/Modals/ModalWrapper.jsx';
import { useStore } from './store.js';

function App() {
  const plusContainer = document.getElementById('plus-wrapper');
  const modalContainer = document.getElementById('modal-wrapper');
  const [listPromise] = useState(() => {
    return sendRequest('fetch').then((response) => response.data);
  });
  const [modal, setModal] = useState({ type: 'none', data: null });
  const list = useStore((store) => store.list);
  console.log(list);
  const [optimisticList, setOptimisticList] = useOptimistic(list);

  return (
    <>
      <ListContainer
        listPromise={listPromise}
        setModal={setModal}
        optimisticList={optimisticList}
      />
      {createPortal(<AddButton setModal={setModal} />, plusContainer)}
      {createPortal(
        <ModalWrapper
          modal={modal}
          setModal={setModal}
          optimisticList={optimisticList}
          setOptimisticList={setOptimisticList}
        />,
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
