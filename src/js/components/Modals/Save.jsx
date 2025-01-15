import { useContext, useTransition } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../../store.js';
import { OptimisticContext } from '../../context.jsx';
import { saveChanges } from '../../utils/saveChanges.js';

/**
 * A React component that represents the 'Save' button in the modal window.
 *
 * When clicked, it creates or updates an item in the list and saves the state
 * of the list to the server. If the item is created, it appends it to the list.
 * If the item is updated, it updates it in the list.
 *
 * @param {object} props - The properties of the component.
 * @param {string} props.id - The id of the item to be saved. If not provided, a
 *   new item will be created.
 * @param {boolean} props.done - The done status of the item to be saved.
 * @param {string} props.date - The date of the item to be saved.
 * @returns {ReactElement} - The rendered component.
 */
function Save({ id, done, date }) {
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

  const [isPending, startTransition] = useTransition();
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
