import { useStore } from '../store';

function AddButton() {
  const setModal = useStore((state) => state.setModal);
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
