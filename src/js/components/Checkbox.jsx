import { useTransition, useOptimistic } from 'react';
import { useStore } from '../store.js';
import { makeRequest } from '../makeRequest.js';
import { prepareList } from './prepareList.js';

function Checkbox({ id, done, optimisticList }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticDone, setOptimisticDone] = useOptimistic(done);
  const update = useStore((store) => store.update);
  const list = useStore((store) => store.list);
  const setList = useStore((store) => store.setList);

  const handleChange = async () => {
    startTransition(async () => {
      const newDone = !optimisticDone;
      setOptimisticDone(newDone);
      const targetRow = optimisticList.find((item) => item.id === id);
      const a = { ...targetRow, done: newDone };
      console.log(a);
      update(a);
      try {
        const response = await makeRequest();
        const newList = prepareList(list, response.operations);
        setList(newList);
        // list.map((item) => {
        //   if (item.id === id) return { ...item, done: newDone };
        //   return item;
        // }),
      } catch (e) {
        console.log('List state reverted');
      }
    });
  };

  return (
    <div className="list-item-done-container">
      <input
        className="list-item-done"
        type="checkbox"
        id={id}
        checked={optimisticDone}
        onChange={handleChange}
      />
      <label htmlFor={id}></label>
    </div>
  );
}

export { Checkbox };
