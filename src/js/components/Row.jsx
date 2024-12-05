import { useState } from 'react';
import { RowDescription } from './RowDescription.jsx';
import { Checkbox } from './Checkbox.jsx';
import Pen from '../../img/pen.svg?react';
import Bin from '../../img/bin.svg?react';

function Row({ id, name, description, done, date, setModal, optimisticList }) {
  const [isOpened, setIsOpened] = useState(false);

  const handleNameClick = () => setIsOpened(!isOpened);

  return (
    <li className="list-item" data-id={id}>
      <Checkbox id={id} done={done} optimisticList={optimisticList} />
      {description ? (
        <div className="list-item-ticket spoiler" onClick={handleNameClick}>
          <div className="list-item-title">{name}</div>
          <RowDescription isOpened={isOpened}>{description}</RowDescription>
        </div>
      ) : (
        <div className="list-item-ticket">
          <div className="list-item-title">{name}</div>
        </div>
      )}
      <div className="list-item-date">{date}</div>
      <div className="list-item-actions">
        <Pen
          className="list-item-actions-update"
          onClick={() =>
            setModal({
              type: 'update',
              data: { id, name, description, date, done },
            })
          }
        />
        <Bin
          className="list-item-actions-delete"
          onClick={() => setModal({ type: 'delete', data: { id } })}
        />
      </div>
    </li>
  );
}

export { Row };
