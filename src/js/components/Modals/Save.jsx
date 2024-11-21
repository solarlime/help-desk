import { useStore } from '../../store.js';

function Save() {
  const canSubmit = useStore((state) => state.form.canSubmit);

  return (
    <button className="save" type="button" disabled={!canSubmit}>
      Save
    </button>
  );
}

export { Save };
