function Description({ isOpened, children }) {
  return (
    <div
      className={`list-item-description ${isOpened ? 'no-spoiler' : 'hidden'}`}
    >
      <pre className="list-item-description-content">{children}</pre>
    </div>
  );
}

export { Description };
