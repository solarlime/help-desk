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
          setModalType('none');
        }
      }
    });
    setHasListener(true);
  }
};

export { setEscListener };
