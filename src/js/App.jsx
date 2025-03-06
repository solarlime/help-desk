import { createPortal, preconnect } from 'react-dom';
import { useState, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { sendRequest } from './utils/sendRequest.js';
import { ListContainer } from './components/List.jsx';
import { AddButton } from './components/AddButton.jsx';
import { ViewModeSwitcher } from './components/ViewModeSwitcher.jsx';
import { ModalWrapper } from './components/Modals/ModalWrapper.jsx';
import { useStore } from './store.js';
import { OptimisticContext, OptimisticProvider } from './context.jsx';
import { useShallow } from 'zustand/react/shallow';

const TableHeader = () => {
  const { isCompact } = useContext(OptimisticContext);

  return (
    <thead>
      <tr className="list-item">
        <td className="list-item-done-container"></td>
        <td className="list-item-ticket">Ticket</td>
        {isCompact ? null : <td className="list-item-date">Date</td>}
        <td className="list-item-actions">Actions</td>
      </tr>
    </thead>
  );
};

function App() {
  const plusContainer = document.getElementById('plus-wrapper');
  const switcherContainer = document.getElementById('switcher-wrapper');
  const modalContainer = document.getElementById('modal-wrapper');
  const [listPromise] = useState(() => {
    return sendRequest('fetch').then((response) => response.data);
  });

  const list = useStore(useShallow((store) => store.getList()));

  return (
    <OptimisticProvider list={list}>
      <TableHeader />
      <ListContainer listPromise={listPromise} />
      {createPortal(<AddButton />, plusContainer)}
      {createPortal(<ViewModeSwitcher />, switcherContainer)}
      {createPortal(<ModalWrapper />, modalContainer)}
    </OptimisticProvider>
  );
}

const init = () => {
  const root = document.getElementById('root');
  preconnect(`${import.meta.env.HOST}/help-desk/`);
  createRoot(root).render(<App />);
};

export { init };
