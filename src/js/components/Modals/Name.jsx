import { useState } from 'react';
import { useStore } from '../../store.js';
import { isValidName } from '../../validation.js';

function Name({ ref }) {
  const formName = useStore((store) => store.form.name);
  const setFormName = useStore((store) => store.setFormName);
  const canSubmit = useStore((store) => store.form.canSubmit);
  const setFormCanSubmit = useStore((store) => store.setFormCanSubmit);
  const [isError, setIsError] = useState(false);

  const handleChange = (event) => {
    if (isValidName(event.target.value)) setFormName(event.target.value);
  };

  const handleBlur = () => {
    // Do it only if the modal is defined
    if (ref?.current) {
      const trimmed = formName.trim();
      setFormName(
        formName
          .split(' ')
          .filter((word) => word.length)
          .join(' '),
      );
      if (trimmed.length && !canSubmit) {
        setFormCanSubmit(true);
      }
      if (!trimmed.length) {
        if (canSubmit) {
          setFormCanSubmit(false);
        }
        setIsError(true);
      }
    }
  };

  return (
    <label className="form-title">
      Title
      <input
        id="title"
        placeholder="A very remarkable title"
        type="text"
        ref={ref}
        required
        value={formName}
        onFocus={() => {
          setFormCanSubmit(false);
          if (isError) setIsError(false);
        }}
        onChange={handleChange}
        // In order to prevent blurring on cancel
        onBlur={() => setTimeout(handleBlur, 200)}
      />
      {isError ? (
        <span className="error error-name">
          {!formName.trim().length
            ? 'You need to fill the title in'
            : 'This value is invalid'}
        </span>
      ) : null}
    </label>
  );
}

export { Name };
