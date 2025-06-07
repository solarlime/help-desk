import { useRef, useEffect, RefObject, Dispatch, SetStateAction } from 'react';
import { Name } from './Name';
import { Description } from './Description';
import { Save } from './Save';
import { useStore } from '../../store';
import { setEscListener } from '../../utils/setEscListener';
import { resolveDate } from '../../utils/resolveDate';
import { Delete } from './Delete';

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
 */
function Modal({
  hasEscListener,
  setHasEscListener,
}: {
  hasEscListener: boolean;
  setHasEscListener: Dispatch<SetStateAction<boolean>>;
}) {
  const focusRef = useRef<HTMLInputElement | HTMLButtonElement | null>(null);

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
    if (focusRef.current) {
      focusRef.current.focus();
    }
  }, [focusRef]);

  useEffect(() => {
    /** Here we check if there is any filled data and deal with it
     *  depending on the current and initial values of the form state.
     */
    if (modalData && 'name' in modalData) {
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
    if (modalData && 'description' in modalData) {
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
              <Name ref={focusRef as RefObject<HTMLInputElement>} />
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
              ref={
                modalType === 'delete'
                  ? (focusRef as RefObject<HTMLButtonElement>)
                  : null
              }
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
