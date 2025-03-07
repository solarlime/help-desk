import { useContext } from 'react';
import { useStore } from '../store';
import { OptimisticContext } from '../context.jsx';
import ClearBox from '../../img/clear_box.svg?react';

function ClearButton() {
  const { optimisticList, isCompact } = useContext(OptimisticContext);
  const setModal = useStore((state) => state.setModal);
  const name = 'Clear done';
  const ids = optimisticList.filter((item) => item.done).map((item) => item.id);

  return (
    <button
      title={name}
      className={`title-container-clear-content ${isCompact ? 'compact' : ''}`}
      type="button"
      onClick={() =>
        setModal({
          type: 'delete',
          data: {
            id: ids,
          },
        })
      }
      disabled={ids.length === 0}
    >
      {isCompact ? <ClearBox /> : name}
    </button>
  );
}

export { ClearButton };
