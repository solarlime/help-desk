import { Suspense, useState, use } from 'react';
import { Row } from './Row.jsx';

function List({ listPromise }) {
  const [listItems, setListItems] = useState(use(listPromise));
  return (
    <ul className="list">
      {listItems.map(({ id, name, description, done, date }) => {
        return (
          <Row
            key={id}
            id={id}
            name={name}
            description={description}
            done={done}
            date={date}
            listSetter={setListItems}
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
