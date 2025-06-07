import { TModalState } from '../../types/store';

/**
 * Sets an event listener for keyup events on the document, which
 * is triggered only once and only if the pressed key is the Escape
 * key. If so, it will call `setModalType` with an empty modal type
 * and data.
 *
 */
const setEscListener = (
  hasListener: boolean,
  setHasListener: (hasListener: boolean) => void,
  modalTypeProperty: string,
  setModalType: (modalType: TModalState) => void,
) => {
  if (!hasListener) {
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (modalTypeProperty !== 'none') {
          setModalType({ type: 'none', data: null });
        }
      }
    });
    setHasListener(true);
  }
};

export { setEscListener };
