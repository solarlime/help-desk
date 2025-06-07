import { useStore } from '../store';
import type { TViewMode } from '../../types/modes';

function SwitcherButton({
  buttonMode,
  itemsQuantity,
}: {
  buttonMode: TViewMode;
  itemsQuantity: number;
}) {
  const mode = useStore((store) => store.mode);
  const setMode = useStore((store) => store.setMode);
  return (
    <button
      title={`Show ${buttonMode} tickets`}
      name={buttonMode}
      className={
        mode === buttonMode ? 'footer-button-active' : 'footer-button-inactive'
      }
      type="button"
      onClick={() => setMode(buttonMode)}
      disabled={mode === buttonMode}
    >
      {`${buttonMode.slice(0, 1).toUpperCase() + buttonMode.slice(1)} (${itemsQuantity})`}
    </button>
  );
}

export { SwitcherButton };
