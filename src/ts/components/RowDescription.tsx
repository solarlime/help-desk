import type { ReactNode } from 'react';

function RowDescription({ children }: { children: ReactNode }) {
  return (
    <div className={`list-item-description`}>
      <div>
        <pre className="list-item-description-content">{children}</pre>
      </div>
    </div>
  );
}

export { RowDescription };
