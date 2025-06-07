import { useContext, useTransition } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../../store';
import { OptimisticContext } from '../../context';
import { saveChanges } from '../../utils/saveChanges';
import type { ITicket } from '../../../types/store';

/**
 * A React component that represents the 'Save' button in the modal window.
 *
 * When clicked, it creates or updates an item in the list and saves the state
 * of the list to the server. If the item is created, it appends it to the list.
 * If the item is updated, it updates it in the list.
 *
 */
function Save({
  id,
  done,
  date,
}: Pick<ITicket, 'done' | 'date'> & { id: string | null }) {
  const { optimisticList, setOptimisticList } = useContext(OptimisticContext);
  const canSubmit = useStore((state) => state.form.canSubmit);
  const newName = useStore((state) => state.form.name);
  const newDescription = useStore((state) => state.form.description);
  const initialFormName = useStore((state) => state.form.initialName);
  const initialFormDescription = useStore(
    (state) => state.form.initialDescription,
  );
  const create = useStore((store) => store.create);
  const update = useStore((store) => store.update);
  const list = useStore((store) => store.list);
  const setList = useStore((store) => store.setList);
  const setModal = useStore((store) => store.setModal);

  const { 1: startTransition } = useTransition();
  const handleClick = () => {
    setModal({ type: 'none', data: null });
    // Save only if there are changes. Otherwise, do nothing
    if (
      initialFormName !== newName ||
      initialFormDescription !== newDescription
    ) {
      startTransition(async () => {
        const newData = {
          id: id ? id : uuidv4(),
          name: newName,
          description: newDescription,
          date,
          done,
        };
        // If there is no id, it means we are creating a new item
        if (!id) {
          setOptimisticList([...optimisticList, newData]);
          create(newData);
        } else {
          // Otherwise, we are updating an existing item
          setOptimisticList(
            optimisticList.map((item) => {
              if (item.id === newData.id) return { ...newData };
              return item;
            }),
          );
          update(newData);
        }
        await saveChanges(list, setList);
      });
    }
  };

  return (
    <button
      className="save"
      type="button"
      disabled={!canSubmit}
      onClick={handleClick}
    >
      Save
    </button>
  );
}

export { Save };
