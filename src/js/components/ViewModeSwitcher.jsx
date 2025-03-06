import { useStore } from '../store.js';

function ViewModeSwitcher() {
  const mode = useStore((store) => store.mode);
  const setMode = useStore((store) => store.setMode);
  return (
    <div className="footer-switcher-buttons">
      <button
        name="all"
        className={
          mode === 'all' ? 'footer-button-active' : 'footer-button-inactive'
        }
        type="button"
        onClick={() => setMode('all')}
        disabled={mode === 'all'}
      >
        All
      </button>
      <button
        name="active"
        className={
          mode === 'active' ? 'footer-button-active' : 'footer-button-inactive'
        }
        type="button"
        onClick={() => setMode('active')}
        disabled={mode === 'active'}
      >
        Active
      </button>
      <button
        name="done"
        className={
          mode === 'done' ? 'footer-button-active' : 'footer-button-inactive'
        }
        type="button"
        onClick={() => setMode('done')}
        disabled={mode === 'done'}
      >
        Done
      </button>
    </div>
  );
}

export { ViewModeSwitcher };
