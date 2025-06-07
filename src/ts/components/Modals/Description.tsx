import { useStore } from '../../store';
import type { ChangeEvent } from 'react';

function Description() {
  const formDescription = useStore((store) => store.form.description);
  const setFormDescription = useStore((store) => store.setFormDescription);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormDescription(event.target.value);
  };

  return (
    <label className="form-description">
      Description
      <textarea
        id="description"
        placeholder="A big and verbose description"
        value={formDescription}
        onChange={handleChange}
      ></textarea>
    </label>
  );
}

export { Description };
