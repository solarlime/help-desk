function Checkbox({ id, done, setList }) {
  return (
    <div className="list-item-done-container">
      <input
        className="list-item-done"
        type="checkbox"
        id={id}
        checked={done}
        onChange={() => {}}
      />
      <label htmlFor={id}></label>
    </div>
  );
}

export { Checkbox };
