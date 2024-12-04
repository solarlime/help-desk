import { useTransition } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStore } from '../../store.js';
import { makeRequest } from '../../makeRequest.js';
import { prepareList } from '../prepareList.js';

function Save({ id, done, date, setModal, optimisticList, setOptimisticList }) {
  const canSubmit = useStore((state) => state.form.canSubmit);
  const newName = useStore((state) => state.form.name);
  const newDescription = useStore((state) => state.form.description);
  const create = useStore((store) => store.create);
  const update = useStore((store) => store.update);
  const list = useStore((store) => store.list);
  const setList = useStore((store) => store.setList);

  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    setModal({ type: 'none', data: null });
    startTransition(async () => {
      console.log(done);
      const newData = {
        id: id ? id : uuidv4(),
        name: newName,
        description: newDescription,
        date,
        done,
      };
      if (!id) {
        setOptimisticList([...optimisticList, newData]);
        create(newData);
      } else {
        setOptimisticList(
          optimisticList.map((item) => {
            if (item.id === newData.id) return { ...newData };
            return item;
          }),
        );
        update(newData);
      }
      try {
        const response = await makeRequest();
        const newList = prepareList(list, response.operations);
        setList(newList);

        // if (id) {
        //   // Update
        //   setList(
        //     list.map((item) => {
        //       if (item.id === newData.id) return { ...newData };
        //       return item;
        //     }),
        //   );
        // } else {
        //   // New
        //   setList([...list, newData]);
        // }
      } catch (e) {
        console.log('List state reverted');
      }
    });
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
