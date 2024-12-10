import { Suspense, use, useContext, useEffect, useState } from 'react';
import { useStore } from '../store.js';
import { Row } from './Row.jsx';
import { OptimisticContext } from '../context.jsx';

function List({ listPromise }) {
  const initialListItems = use(listPromise);
  const [initiated, setInitiated] = useState(false);
  const { optimisticList } = useContext(OptimisticContext);
  const setList = useStore((store) => store.setList);

  useEffect(() => {
    setList(initialListItems);
    setInitiated(true);
  }, []);

  return (
    <ul className="list">
      {(optimisticList.length || initiated
        ? optimisticList
        : initialListItems
      ).map(({ id, name, description, done, date }) => {
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
      })}
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
