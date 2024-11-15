import { useRef, useEffect } from 'react';
import { setEscListener } from './setEscListener.js';

function Modal({ modalType, setModalType, hasEscListener, setHasEscListener }) {
  const focusRef = useRef(null);

  useEffect(() => {
    focusRef.current.focus();
  }, [focusRef]);

  useEffect(
    () =>
      setEscListener(
        hasEscListener,
        setHasEscListener,
        modalType,
        setModalType,
      ),
    [hasEscListener, setHasEscListener, modalType, setModalType],
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
                />
                <span className="error error-name hidden"></span>
              </label>
              <label className="form-description">
                Description
                <textarea
                  id="description"
                  placeholder="A big and verbose description"
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
                  onClick={() => setModalType('none')}
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
                  onClick={() => setModalType('none')}
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
