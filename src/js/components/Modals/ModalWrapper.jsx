import { useState } from 'react';
import { Modal } from './Modal.jsx';

function ModalWrapper({ modalType, setModalType }) {
  const [hasEscListener, setHasEscListener] = useState(false);

  if (modalType === 'none') {
    return null;
  }
  return (
    <Modal
      modalType={modalType}
      setModalType={setModalType}
      hasEscListener={hasEscListener}
      setHasEscListener={setHasEscListener}
    />
  );
}

export { ModalWrapper };
