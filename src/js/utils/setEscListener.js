/**
 * Sets an event listener for keyup events on the document, which
 * is triggered only once and only if the pressed key is the Escape
 * key. If so, it will call `setModalType` with an empty modal type
 * and data.
 *
 * @param {boolean} hasListener - Whether the listener is already set.
 * @param {function} setHasListener - A function to set `hasListener`
 *   to `true` or `false`.
 * @param {object} modalType - The current modal type.
 * @param {function} setModalType - A function to set the modal type.
 */
const setEscListener = (
  hasListener,
  setHasListener,
  modalType,
  setModalType,
) => {
  if (!hasListener) {
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (modalType !== 'none') {
          setModalType({ type: 'none', data: null });
        }
      }
    });
    setHasListener(true);
  }
};

export { setEscListener };
