import { Suspense, useState, use } from 'react';
import { Row } from './Row.jsx';

function List({ listPromise, setModal }) {
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
            setModal={setModal}
          />
        );
      })}
    </ul>
  );
}

function ListContainer({ listPromise, setModal }) {
  return (
    <Suspense
      fallback={
        <ul className="list">
          <li className="list-item centered">Loading...</li>
        </ul>
      }
    >
      <List listPromise={listPromise} setModal={setModal} />
    </Suspense>
  );
}

export { ListContainer };
