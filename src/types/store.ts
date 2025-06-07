export interface ITicket {
  id: string;
  name: string;
  description: string;
  date: string;
  done: boolean;
}

export type TModalState =
  | {
      type: 'none' | 'create';
      data: null;
    }
  | {
      type: 'update';
      data: ITicket;
    }
  | {
      type: 'delete';
      data: Pick<ITicket, 'id'> | { id: Array<string> };
    };

interface IFormState {
  initialName: string;
  initialDescription: string;
  name: string;
  description: string;
  canSubmit: boolean;
}

type TMode = 'all' | 'active' | 'done';

export interface IList {
  list: Array<ITicket>;
  mode: TMode;
}

export interface IListActions {
  setList: (list: Array<ITicket>) => void;
  setMode: (mode: TMode) => void;
}

export interface IModal {
  modal: TModalState;
}

export interface IModalActions {
  setModal: (modalState: TModalState) => void;
}

export interface IForm {
  form: IFormState;
}

export interface IFormActions {
  setFormInitialName: (initialName: string) => void;
  setFormName: (name: string) => void;
  setFormInitialDescription: (initialDescription: string) => void;
  setFormDescription: (description: string) => void;
  setFormCanSubmit: (canSubmit: boolean) => void;
}

export interface IOperations {
  create: Array<ITicket>;
  update: Array<ITicket>;
  delete: Array<Pick<ITicket, 'id'>>;
}

export interface IRequest {
  operations: IOperations;
}

export interface IRequestActions {
  create: (newRow: ITicket) => void;
  update: (rowToUpdate: ITicket) => void;
  delete: (rowToDelete: Pick<ITicket, 'id'>) => void;
}

export type TStore = IList &
  IListActions &
  IModal &
  IModalActions &
  IForm &
  IFormActions &
  IRequest &
  IRequestActions;
