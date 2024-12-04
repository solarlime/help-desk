import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const listInitialState = {
  list: [],
};

const formInitialState = {
  form: {
    initialName: '',
    initialDescription: '',
    name: '',
    description: '',
    canSubmit: false,
  },
};

const requestInitialState = {
  operations: {
    create: [],
    update: [],
    delete: [],
  },
};

const createListSlice = (set) => ({
  ...listInitialState,
  setList: (list) => set((state) => ({ list })),
});

const createFormSlice = (set) => ({
  ...formInitialState,
  setFormInitialName: (initialName) =>
    set((state) => ({ form: { ...state.form, initialName } })),
  setFormName: (name) => set((state) => ({ form: { ...state.form, name } })),
  setFormInitialDescription: (initialDescription) =>
    set((state) => ({ form: { ...state.form, initialDescription } })),
  setFormDescription: (description) =>
    set((state) => ({ form: { ...state.form, description } })),
  setFormCanSubmit: (canSubmit) =>
    set((state) => ({ form: { ...state.form, canSubmit } })),
});

const createRequestSlice = (set) => ({
  ...requestInitialState,
  create: (newRow) =>
    set((state) => ({
      operations: {
        ...state.operations,
        create: [...state.operations.create, newRow],
      },
    })),
  delete: (rowToDelete) =>
    set((state) => {
      const oldCreate = state.operations.create;
      // This id may be just created and not already sent
      const justCreated = oldCreate.find((item) => item.id === rowToDelete.id);
      if (justCreated) {
        // If so - remove from created
        return {
          operations: {
            ...state.operations,
            create: [...oldCreate.filter((item) => item !== justCreated)],
          },
        };
      } else {
        const oldUpdate = state.operations.update;
        // This id may be just updated and not already sent
        const alreadyAddedToUpdate = oldUpdate.find(
          (item) => item.id === rowToDelete.id,
        );
        if (alreadyAddedToUpdate) {
          // If so - remove updates for this id & add for deleting
          return {
            operations: {
              ...state.operations,
              update: [
                ...oldUpdate.filter((item) => item !== alreadyAddedToUpdate),
              ],
              delete: [...state.operations.delete, rowToDelete],
            },
          };
        } else {
          // Otherwise add new object for deleting
          return {
            operations: {
              ...state.operations,
              delete: [...state.operations.delete, rowToDelete],
            },
          };
        }
      }
    }),
  update: (rowToUpdate) =>
    set((state) => {
      const oldUpdate = state.operations.update;
      const oldCreate = state.operations.create;
      // This id may be already updated
      const alreadyAddedToUpdate = oldUpdate.find(
        (item) => item.id === rowToUpdate.id,
      );
      if (!alreadyAddedToUpdate) {
        // This id may be already created
        const alreadyAddedToCreate = oldCreate.find(
          (item) => item.id === rowToUpdate.id,
        );
        if (!alreadyAddedToCreate) {
          // If no - add new object for updating
          return {
            operations: {
              ...state.operations,
              update: [...oldUpdate, rowToUpdate],
            },
          };
        } else {
          // Otherwise change existing object with new information
          return {
            operations: {
              ...state.operations,
              create: [
                ...oldCreate.filter((item) => item.id !== rowToUpdate.id),
                rowToUpdate,
              ],
            },
          };
        }
      } else {
        // Otherwise change existing object with new information
        return {
          operations: {
            ...state.operations,
            update: [
              ...oldUpdate.filter((item) => item.id !== rowToUpdate.id),
              rowToUpdate,
            ],
          },
        };
      }
    }),
});

export const storeCreator = (...a) => ({
  ...createListSlice(...a),
  ...createFormSlice(...a),
  ...createRequestSlice(...a),
});

const useStore = create()(devtools(storeCreator));

export { useStore, requestInitialState, formInitialState };
