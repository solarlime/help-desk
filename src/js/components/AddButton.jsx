function AddButton({ setModal }) {
  return (
    <button
      className="title-container-plus-content"
      type="button"
      onClick={() => setModal({ type: 'create', data: null })}
    >
      Add new ticket
    </button>
  );
}

export { AddButton };
