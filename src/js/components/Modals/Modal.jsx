import { useRef, useEffect } from 'react';
import { Name } from './Name.jsx';
import { Description } from './Description.jsx';
import { Save } from './Save.jsx';
import { useStore } from '../../store.js';
import { setEscListener } from '../../utils/setEscListener.js';
import { resolveDate } from '../../utils/resolveDate.js';
import { Delete } from './Delete.jsx';

/**
 * A React component that represents a modal window.
 *
 * The component is responsible for rendering a modal window with the
 * following components:
 *
 * - `Name` component: a text field to enter a new name or update an existing
 *   one.
 * - `Description` component: a text field to enter a new description or update
 *   an existing one.
 * - `Save` component: a button to save the changes.
 * - `Delete` component: a button to delete the item (or items).
 *
 * The component also sets up an event listener for keyup events to close the
 * modal window when the Escape key is pressed.
 *
 * @param {boolean} hasEscListener - Whether there is already an event listener
 *   for the Escape key.
 * @param {function} setHasEscListener - A function to set `hasEscListener` to
 *   `true` or `false`.
 *
 * @returns {ReactElement} - The rendered modal window.
 */
function Modal({ hasEscListener, setHasEscListener }) {
  const focusRef = useRef(null);

  const initialFormName = useStore((state) => state.form.initialName);
  const setInitialFormName = useStore((state) => state.setFormInitialName);
  const setFormName = useStore((state) => state.setFormName);

  const initialFormDescription = useStore(
    (state) => state.form.initialDescription,
  );
  const setInitialFormDescription = useStore(
    (state) => state.setFormInitialDescription,
  );
  const setFormDescription = useStore((state) => state.setFormDescription);

  const modal = useStore((state) => state.modal);
  const setModal = useStore((state) => state.setModal);
  const { type: modalType, data: modalData } = modal;

  useEffect(() => {
    focusRef.current.focus();
  }, [focusRef]);

  useEffect(() => {
    /** Here we check if there is any filled data and deal with it
     *  depending on the current and initial values of the form state.
     */
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
            Array.isArray(modalData.id) ? (
              <label>{`Do you want to remove ${modalData.id.length} ticket${modalData.id.length > 1 ? 's' : ''}?`}</label>
            ) : (
              <label>Do you want to remove this ticket?</label>
            )
          ) : (
            <>
              <Name ref={focusRef} />
              <Description />
            </>
          )}
          <div className="button-container">
            {modalType === 'delete' ? (
              <Delete id={modalData.id} />
            ) : (
              <Save
                id={modalData?.id || null}
                done={modalData?.done || false}
                date={modalData?.date || resolveDate()}
              />
            )}
            <button
              className="cancel"
              type="button"
              onClick={() => setModal({ type: 'none', data: null })}
              ref={modalType === 'delete' ? focusRef : null}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { Modal };
