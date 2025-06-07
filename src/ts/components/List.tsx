import { Suspense, use, useContext, useEffect, useState } from 'react';
import { useStore } from '../store';
import { Row } from './Row';
import { OptimisticContext } from '../context';
import type { ITicket } from '../../types/store';

/**
 * React component for rendering a list of items.
 *
 * Given a promise that resolves to the list of items, this component
 * renders a table body of the list items. The list items are expected
 * to be an array of objects with the keys 'id', 'name', 'description',
 * 'done', and 'date'. Each list item is rendered as a `Row` component.
 *
 * This component uses the `useStore` hook to get the list state and
 * the `useContext` hook to get the displayed optimistic list state.
 * If the displayed optimistic list is not empty, it is rendered.
 * Otherwise, it renders the list of items from the promise.
 *
 */
function List({ listPromise }: { listPromise: Promise<Array<ITicket>> }) {
  const initialListItems = use(listPromise);
  const [initiated, setInitiated] = useState(false);
  const { displayedOptimisticList } = useContext(OptimisticContext);
  const setList = useStore((store) => store.setList);

  useEffect(() => {
    setList(initialListItems);
    setInitiated(true);
  }, []);

  return (
    <tbody className="list">
      {(displayedOptimisticList.length || initiated
        ? displayedOptimisticList
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
    </tbody>
  );
}

function ListContainer({
  listPromise,
}: {
  listPromise: Promise<Array<ITicket>>;
}) {
  return (
    <Suspense
      fallback={
        <tbody className="list">
          <tr className="list-item centered">
            <td className="list-item-generic">Loading...</td>
          </tr>
        </tbody>
      }
    >
      <List listPromise={listPromise} />
    </Suspense>
  );
}

export { ListContainer };
