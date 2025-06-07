import { createPortal, preconnect } from 'react-dom';
import { useState, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { sendRequest } from './utils/sendRequest';
import { ListContainer } from './components/List';
import { AddButton } from './components/AddButton';
import { ClearButton } from './components/ClearButton';
import { ViewModeSwitcher } from './components/ViewModeSwitcher';
import { ModalWrapper } from './components/Modals/ModalWrapper';
import { useStore } from './store';
import { OptimisticContext, OptimisticProvider } from './context';
import type { ITicket } from '../types/store';

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
  const plusContainer = document.getElementById('plus-wrapper')!;
  const clearContainer = document.getElementById('clear-wrapper')!;
  const switcherContainer = document.getElementById('switcher-wrapper')!;
  const modalContainer = document.getElementById('modal-wrapper')!;
  const { 0: listPromise } = useState(() => {
    return sendRequest('fetch').then(
      (response) => response.data as Array<ITicket>,
    );
  });

  const list = useStore((store) => store.list);

  return (
    <OptimisticProvider list={list}>
      <TableHeader />
      <ListContainer listPromise={listPromise} />
      {createPortal(<AddButton />, plusContainer)}
      {createPortal(<ClearButton />, clearContainer)}
      {createPortal(<ViewModeSwitcher />, switcherContainer)}
      {createPortal(<ModalWrapper />, modalContainer)}
    </OptimisticProvider>
  );
}

const init = () => {
  const root = document.getElementById('root')!;
  preconnect(`${import.meta.env.HOST}/help-desk/`);
  createRoot(root).render(<App />);
};

export { init };
