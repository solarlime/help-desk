import { Suspense, use, useContext, useEffect } from 'react';
import { useStore } from '../store.js';
import { Row } from './Row.jsx';
import { OptimisticContext } from '../context.jsx';

function List({ listPromise }) {
  const initialListItems = use(listPromise);
  const { optimisticList } = useContext(OptimisticContext);
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
            />
          );
        },
      )}
    </ul>
  );
}

function ListContainer({ listPromise }) {
  return (
    <Suspense
      fallback={
        <ul className="list">
          <li className="list-item centered">Loading...</li>
        </ul>
      }
    >
      <List listPromise={listPromise} />
    </Suspense>
  );
}

export { ListContainer };
