import { useRef, useEffect } from 'react';
import { Name } from './Name.jsx';
import { Description } from './Description.jsx';
import { Save } from './Save.jsx';
import { useStore } from '../../store.js';
import { setEscListener } from './setEscListener.js';
import { resolveDate } from './resolveDate.js';

function Modal({
  modal,
  setModal,
  hasEscListener,
  setHasEscListener,
  optimisticList,
  setOptimisticList,
}) {
  const { type: modalType, data: modalData } = modal;
  const focusRef = useRef(null);
  const initialFormName = useStore((state) => state.form.initialName);
  const setInitialFormName = useStore((state) => state.setFormInitialName);
  const setFormName = useStore((state) => state.setFormName);
  console.log(modalData);
  const initialFormDescription = useStore(
    (state) => state.form.initialDescription,
  );
  const setInitialFormDescription = useStore(
    (state) => state.setFormInitialDescription,
  );
  const setFormDescription = useStore((state) => state.setFormDescription);

  useEffect(() => {
    focusRef.current.focus();
  }, [focusRef]);

  useEffect(() => {
    console.log(modalData);
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
    if (modalData?.description) {
      // Update
      if (initialFormDescription !== modalData.description) {
        setInitialFormDescription(modalData.description);
        setFormDescription(modalData.description);
      }
    } else {
      // New
      if (initialFormDescription !== '') {
        setInitialFormDescription('');
        setFormDescription('');
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
              <Description />
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
                <Save
                  id={modalData?.id || null}
                  done={modalData?.done || false}
                  date={modalData?.date || resolveDate()}
                  setModal={setModal}
                  optimisticList={optimisticList}
                  setOptimisticList={setOptimisticList}
                />
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
