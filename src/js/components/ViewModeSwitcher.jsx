import { useContext } from 'react';
import { SwitcherButton } from './SwitcherButton.jsx';
import { OptimisticContext } from '../context.jsx';

function ViewModeSwitcher() {
  const { optimisticList } = useContext(OptimisticContext);

  const quantities = {
    all: optimisticList.length,
    active: optimisticList.filter((item) => item.done !== true).length,
    done: optimisticList.filter((item) => item.done === true).length,
  };

  return (
    <div className="footer-switcher-buttons">
      <SwitcherButton buttonMode="all" itemsQuantity={quantities.all} />
      <SwitcherButton buttonMode="active" itemsQuantity={quantities.active} />
      <SwitcherButton buttonMode="done" itemsQuantity={quantities.done} />
    </div>
  );
}

export { ViewModeSwitcher };
