import { useRef, useEffect } from 'react';
import { Name } from './Name.jsx';
import { Save } from './Save.jsx';
import { useStore } from '../../store.js';
import { setEscListener } from './setEscListener.js';

function Modal({ modal, setModal, hasEscListener, setHasEscListener }) {
  const { type: modalType, data: modalData } = modal;
  const focusRef = useRef(null);
  const initialFormName = useStore((state) => state.form.initialName);
  const setInitialFormName = useStore((state) => state.setFormInitialName);
  const setFormName = useStore((state) => state.setFormName);

  useEffect(() => {
    focusRef.current.focus();
  }, [focusRef]);

  useEffect(() => {
    if (modalData?.name) {
      // Update
      if (initialFormName !== modalData.name) {
        // Opened another row
        setInitialFormName(modalData.name);
        setFormName(modalData.name);
      }
    } else {
      // New
      if (initialFormName !== '') {
        // Opened the accidentally closed 'new' modal
        setInitialFormName('');
        setFormName('');
      }
    }
  }, []);

  useEffect(
    () =>
      setEscListener(hasEscListener, setHasEscListener, modalType, setModal),
    [hasEscListener, setHasEscListener, modalType, setModal],
  );

  return (
    <div className="modal-container">
      <div className="modal">
        <form
          id={modalType === 'delete' ? modalType : 'add-and-update'}
          noValidate
        >
          {modalType === 'delete' ? (
            <label>Do you want to remove this ticket?</label>
          ) : (
            <>
              <Name ref={focusRef} />
              <label className="form-description">
                Description
                <textarea
                  id="description"
                  placeholder="A big and verbose description"
                  defaultValue={modalData?.description ?? ''}
                ></textarea>
              </label>
            </>
          )}
          <div className="button-container">
            {modalType === 'delete' ? (
              <>
                <button className="delete" type="button">
                  Delete
                </button>
                <button
                  className="cancel"
                  type="button"
                  onClick={() => setModal({ type: 'none', data: null })}
                  ref={focusRef}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <Save />
                <button
                  className="cancel"
                  type="button"
                  onClick={() => setModal({ type: 'none', data: null })}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export { Modal };
