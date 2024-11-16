import { useState } from 'react';
import { Description } from './Description.jsx';
import { Checkbox } from './Checkbox.jsx';
import Pen from '../../img/pen.svg?react';
import Bin from '../../img/bin.svg?react';

function Row({ id, name, description, done, date, listSetter, setModal }) {
  const [isOpened, setIsOpened] = useState(false);

  const handleNameClick = () => setIsOpened(!isOpened);

  return (
    <li className="list-item" data-id={id}>
      <Checkbox id={id} done={done} setList={listSetter} />
      <div className={`list-item-ticket ${description ? 'spoiler' : ''}`}>
        <div className="list-item-title" onClick={handleNameClick}>
          {name}
        </div>
        {description ? (
          <Description isOpened={isOpened}>{description}</Description>
        ) : null}
      </div>
      <div className="list-item-date">{date}</div>
      <div className="list-item-actions">
        <Pen
          className="list-item-actions-update"
          onClick={() =>
            setModal({ type: 'update', data: { id, name, description } })
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
