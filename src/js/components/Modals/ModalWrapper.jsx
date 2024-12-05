import { useState } from 'react';
import { Modal } from './Modal.jsx';
import { useStore } from '../../store.js';

function ModalWrapper() {
  const [hasEscListener, setHasEscListener] = useState(false);
  const modal = useStore((state) => state.modal);

  if (modal.type === 'none') {
    return null;
  }
  return (
    <Modal
      hasEscListener={hasEscListener}
      setHasEscListener={setHasEscListener}
    />
  );
}

export { ModalWrapper };
