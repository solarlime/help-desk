import {
  createContext,
  useOptimistic,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useStore } from './store';
import type { ITicket } from '../types/store';
import type { IOptimisticContext } from '../types/context';

export const OptimisticContext = createContext<IOptimisticContext>(
  {} as IOptimisticContext,
);

/**
 * A context provider for an optimistic list and a flag indicating whether the
 * layout should be compact.
 *
 * The `OptimisticProvider` component takes a `list` prop, which is an array of
 * objects with `id`, `name`, `description`, `done`, and `date` properties.
 * Internally, it uses the `useOptimistic` hook to manage an optimistic list
 * state, which is an array of objects with the same shape as the `list` prop.
 *
 * The optimistic list directly depends on the `list` prop got from the store.
 * However, the provider also generates displayedOptimisticList in order
 * to show only the needed parts.
 *
 * The `OptimisticProvider` also manages a state `isCompact`, which is a boolean
 * indicating whether the layout should be compact. It is `true` when the
 * viewport is narrower than 500px, and `false` otherwise.
 *
 * The `OptimisticProvider` component renders a `OptimisticContext.Provider`
 * component with the `optimisticList` and `isCompact` states as its value.
 *
 */
export const OptimisticProvider = ({
  children,
  list,
}: {
  children: ReactNode;
  list: Array<ITicket>;
}) => {
  const mode = useStore((state) => state.mode);
  const [optimisticList, setOptimisticList] =
    useOptimistic<Array<ITicket>>(list);
  const [isCompact, setIsCompact] = useState<boolean>(
    document.documentElement.clientWidth <= 500,
  );

  useEffect(() => {
    const compactMatcher = window.matchMedia('(max-width: 500px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsCompact(event.matches);
    };
    if (compactMatcher.addEventListener) {
      compactMatcher.addEventListener('change', handleChange);
    } else {
      // fallback for Safari 12
      compactMatcher.addListener(handleChange);
    }
    return () => {
      if (compactMatcher.removeEventListener) {
        compactMatcher.removeEventListener('change', handleChange);
      } else {
        // fallback for Safari 12
        compactMatcher.removeListener(handleChange);
      }
    };
  }, []);

  return (
    <OptimisticContext.Provider
      value={{
        optimisticList,
        displayedOptimisticList:
          mode === 'active'
            ? optimisticList.filter((item) => !item.done)
            : mode === 'done'
              ? optimisticList.filter((item) => item.done)
              : optimisticList,
        setOptimisticList,
        isCompact,
      }}
    >
      {children}
    </OptimisticContext.Provider>
  );
};
