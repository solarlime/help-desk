import { useStore } from '../../store.js';

function Description() {
  const formDescription = useStore((store) => store.form.description);
  const setFormDescription = useStore((store) => store.setFormDescription);

  const handleChange = (event) => {
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
