import { useRef, useEffect } from 'react';
import { setEscListener } from './setEscListener.js';

function Modal({ modal, setModal, hasEscListener, setHasEscListener }) {
  const { type: modalType, data: modalData } = modal;
  const focusRef = useRef(null);

  useEffect(() => {
    focusRef.current.focus();
  }, [focusRef]);

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
              <label className="form-title">
                Title
                <input
                  id="title"
                  placeholder="A very remarkable title"
                  type="text"
                  ref={focusRef}
                  required
                  defaultValue={modalData?.name ?? ''}
                />
                <span className="error error-name hidden"></span>
              </label>
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
                <button className="save" type="button">
                  Save
                </button>
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
