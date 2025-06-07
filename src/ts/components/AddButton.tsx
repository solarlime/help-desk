import { useContext } from 'react';
import { useStore } from '../store';
import { OptimisticContext } from '../context';
import AddBox from '../../img/add_box.svg?react';

function AddButton() {
  const { isCompact } = useContext(OptimisticContext);
  const setModal = useStore((state) => state.setModal);
  const name = 'Add new ticket';

  return (
    <button
      title={name}
      className={`title-container-plus-content ${isCompact ? 'compact' : ''}`}
      type="button"
      onClick={() => setModal({ type: 'create', data: null })}
    >
      {isCompact ? <AddBox /> : name}
    </button>
  );
}

export { AddButton };
