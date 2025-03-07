import { useContext, useTransition } from 'react';
import { OptimisticContext } from '../../context.jsx';
import { useStore } from '../../store.js';
import { saveChanges } from '../../utils/saveChanges.js';

/**
 * A React component that represents a 'Delete' button in the modal window.
 *
 * When clicked, it removes an item (or items) with a specific `id` from the optimistic list
 * and updates the state of the list by invoking the `deleteItems` method.
 * The changes are then saved to the server. The modal is closed after the delete
 * operation is initiated.
 *
 * @param {object} props - The properties of the component.
 * @param {string | string[]} props.id - The id / ids array of the item(s) to be deleted.
 * @returns {ReactElement} - The rendered component.
 */
function Delete({ id }) {
  const { optimisticList, setOptimisticList } = useContext(OptimisticContext);
  const deleteItems = useStore((store) => store.delete);
  const list = useStore((store) => store.list);
  const setList = useStore((store) => store.setList);
  const setModal = useStore((store) => store.setModal);

  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setModal({ type: 'none', data: null });
    startTransition(async () => {
      if (Array.isArray(id)) {
        setOptimisticList(
          optimisticList.filter((item) => !id.includes(item.id)),
        );
        id.forEach((itemId) => deleteItems({ id: itemId }));
      } else {
        setOptimisticList(optimisticList.filter((item) => item.id !== id));
        deleteItems({ id });
      }
      await saveChanges(list, setList);
    });
  };

  return (
    <button className="delete" type="button" onClick={handleClick}>
      Delete
    </button>
  );
}

export { Delete };
