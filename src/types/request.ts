import type { IRequest, ITicket } from './store';

export type TActions = 'batch' | 'fetch';

export type TResponse =
  | {
      status: 'Batch applied';
      data: IRequest;
    }
  | {
      status: 'Fetched';
      data: Array<ITicket>;
    };
