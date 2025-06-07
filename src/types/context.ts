import type { ITicket } from './store';

export interface IOptimisticContext {
  optimisticList: Array<ITicket>;
  displayedOptimisticList: Array<ITicket>;
  setOptimisticList: (list: Array<ITicket>) => void;
  isCompact: boolean;
}
