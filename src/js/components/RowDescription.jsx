function RowDescription({ children }) {
  return (
    <div className={`list-item-description`}>
      <div>
        <pre className="list-item-description-content">{children}</pre>
      </div>
    </div>
  );
}

export { RowDescription };
