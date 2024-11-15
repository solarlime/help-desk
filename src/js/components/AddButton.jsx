function AddButton({ setModalType }) {
  return (
    <button
      className="title-container-plus-content"
      type="button"
      onClick={() => setModalType('create')}
    >
      Add new ticket
    </button>
  );
}

export { AddButton };
