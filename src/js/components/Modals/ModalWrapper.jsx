import { useState } from 'react';
import { Modal } from './Modal.jsx';

function ModalWrapper({ modal, setModal }) {
  const [hasEscListener, setHasEscListener] = useState(false);

  if (modal.type === 'none') {
    return null;
  }
  return (
    <Modal
      modal={modal}
      setModal={setModal}
      hasEscListener={hasEscListener}
      setHasEscListener={setHasEscListener}
    />
  );
}

export { ModalWrapper };
