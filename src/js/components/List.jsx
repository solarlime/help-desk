import { Suspense, use, useEffect } from 'react';
import { useStore } from '../store.js';
import { Row } from './Row.jsx';

function List({ listPromise, setModal, optimisticList }) {
  const initialListItems = use(listPromise);
  const setList = useStore((store) => store.setList);

  useEffect(() => {
    setList(initialListItems);
  }, []);

  return (
    <ul className="list">
      {(optimisticList.length ? optimisticList : initialListItems).map(
        ({ id, name, description, done, date }) => {
          return (
            <Row
              key={id}
              id={id}
              name={name}
              description={description}
              done={done}
              date={date}
              setModal={setModal}
              optimisticList={optimisticList}
            />
          );
        },
      )}
    </ul>
  );
}

function ListContainer({ listPromise, setModal, optimisticList }) {
  return (
    <Suspense
      fallback={
        <ul className="list">
          <li className="list-item centered">Loading...</li>
        </ul>
      }
    >
      <List
        listPromise={listPromise}
        setModal={setModal}
        optimisticList={optimisticList}
      />
    </Suspense>
  );
}

export { ListContainer };
