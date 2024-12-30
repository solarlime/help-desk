import { createContext, useOptimistic, useState, useEffect } from 'react';

export const OptimisticContext = createContext(null);

export const OptimisticProvider = ({ children, list }) => {
  const [optimisticList, setOptimisticList] = useOptimistic(list);
  const [isCompact, setIsCompact] = useState(
    document.documentElement.clientWidth <= 500,
  );

  useEffect(() => {
    const compactMatcher = window.matchMedia('(max-width: 500px)');
    const handleChange = (event) => {
      setIsCompact(event.matches);
    };
    compactMatcher.addEventListener('change', handleChange);
    return () => compactMatcher.removeEventListener('change', handleChange);
  }, []);

  return (
    <OptimisticContext.Provider
      value={{ optimisticList, setOptimisticList, isCompact }}
    >
      {children}
    </OptimisticContext.Provider>
  );
};
