import { useContext } from 'react';
import { RowDescription } from './RowDescription.jsx';
import { Checkbox } from './Checkbox.jsx';
import Pen from '../../img/pen.svg?react';
import Bin from '../../img/bin.svg?react';
import { useStore } from '../store.js';
import { OptimisticContext } from '../context.jsx';

function Row({ id, name, description, done, date }) {
  const setModal = useStore((state) => state.setModal);
  const { isCompact } = useContext(OptimisticContext);

  return (
    <tr className="list-item">
      <Checkbox id={id} done={done} />
      {/* If there is a description, we show it in a spoiler */}
      {description ? (
        <td className="list-item-ticket spoiler">
          <input
            type="checkbox"
            id={`spoiler-${id}`}
            className="spoiler-checkbox"
          />
          <label htmlFor={`spoiler-${id}`} title="Show / hide description">
            <div className="list-item-title">{name}</div>
            {isCompact ? <div className="list-item-date">{date}</div> : null}
            <RowDescription>{description}</RowDescription>
          </label>
        </td>
      ) : (
        // If there is no description, we just show the title
        <td className="list-item-ticket">
          <div className="list-item-title">{name}</div>
          {isCompact ? <div className="list-item-date">{date}</div> : null}
        </td>
      )}
      {isCompact ? null : <td className="list-item-date">{date}</td>}
      <td className="list-item-actions">
        <button
          title="Update ticket"
          type="button"
          onClick={() =>
            setModal({
              type: 'update',
              data: { id, name, description, date, done },
            })
          }
        >
          <Pen className="list-item-actions-update" />
        </button>
        <button
          title="Delete ticket"
          type="button"
          onClick={() => setModal({ type: 'delete', data: { id } })}
        >
          <Bin className="list-item-actions-delete" />
        </button>
      </td>
    </tr>
  );
}

export { Row };
