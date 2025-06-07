import { useContext } from 'react';
import { SwitcherButton } from './SwitcherButton';
import { OptimisticContext } from '../context';
import type { TQuantities } from '../../types/modes';

function ViewModeSwitcher() {
  const { optimisticList } = useContext(OptimisticContext);

  const quantities: TQuantities = {
    all: optimisticList.length,
    active: optimisticList.filter((item) => !item.done).length,
    done: optimisticList.filter((item) => item.done).length,
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
