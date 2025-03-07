import { useTransition, useOptimistic, useContext } from 'react';
import { useStore } from '../store.js';
import { OptimisticContext } from '../context.jsx';
import { saveChanges } from '../utils/saveChanges.js';

/**
 * Checkbox component for rendering and managing the state of a checkbox.
 *
 * This component uses optimistic UI updates to toggle the `done` state
 * of an item, identified by its `id`. It utilizes the `useTransition`
 * hook for managing asynchronous state transitions and the `useOptimistic`
 * hook for local state management. The component interacts with the global
 * state by using the `useStore` hook and the `OptimisticContext`.
 *
 * @param {Object} props - Component props.
 * @param {string} props.id - Unique identifier for the item.
 * @param {boolean} props.done - Initial state of the checkbox.
 * @returns {ReactElement} - A table cell with a checkbox input.
 */
function Checkbox({ id, done }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticDone, setOptimisticDone] = useOptimistic(done);
  const { optimisticList, setOptimisticList } = useContext(OptimisticContext);

  const update = useStore((store) => store.update);
  const list = useStore((store) => store.list);
  const setList = useStore((store) => store.setList);

  const handleChange = async () => {
    startTransition(async () => {
      const newDone = !optimisticDone;
      setOptimisticDone(newDone);
      setOptimisticList(
        optimisticList.map((item) => {
          if (item.id !== id) return item;
          return { ...item, done: newDone };
        }),
      );
      const targetRow = optimisticList.find((item) => item.id === id);
      const a = { ...targetRow, done: newDone };
      update(a);
      await saveChanges(list, setList);
    });
  };

  return (
    <td className="list-item-done-container">
      <input
        className="list-item-done"
        type="checkbox"
        id={id}
        checked={optimisticDone}
        onChange={handleChange}
      />
      <label
        title={`Mark as ${optimisticDone ? 'undone' : 'done'}`}
        htmlFor={id}
      ></label>
    </td>
  );
}

export { Checkbox };
