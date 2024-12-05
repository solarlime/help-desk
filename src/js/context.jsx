import { createContext, useOptimistic } from 'react';

export const OptimisticContext = createContext(null);

export const OptimisticProvider = ({ children, list }) => {
  const [optimisticList, setOptimisticList] = useOptimistic(list);

  return (
    <OptimisticContext.Provider value={{ optimisticList, setOptimisticList }}>
      {children}
    </OptimisticContext.Provider>
  );
};
