import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const listInitialState = {
  list: [],
  mode: 'all',
};

const modalInitialState = {
  modal: { type: 'none', data: null },
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
  setMode: (mode) => set((state) => ({ ...state, mode })),
  setList: (list) => set((state) => ({ ...state, list })),
});

const createModalSlice = (set) => ({
  ...modalInitialState,
  setModal: (modalState) => set((state) => ({ modal: modalState })),
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

/**
 * Creates a zustand slice for managing requests.
 *
 * This slice contains the following functions:
 *
 * - `create(newRow)`: Adds a new row to the list of rows to create.
 * - `delete(rowToDelete)`: Removes a row to delete from the list of rows to
 *   create if it exists, otherwise adds the row to the list of rows to delete.
 * - `update(rowToUpdate)`: Updates a row in the list of rows to update if it
 *   exists, otherwise adds the row to the list of rows to update or creates it
 *   if it doesn't exist in the list of rows to create.
 *
 * @param {function} set - A function to update the state of the slice.
 * @returns {object} - An object containing the operations to perform with the state.
 */
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
              ...oldUpdate.map((item) => {
                if (item.id === rowToUpdate.id) {
                  return { ...item, ...rowToUpdate };
                }
                return item;
              }),
            ],
          },
        };
      }
    }),
});

export const storeCreator = (...a) => ({
  ...createListSlice(...a),
  ...createModalSlice(...a),
  ...createFormSlice(...a),
  ...createRequestSlice(...a),
});

const useStore = create()(devtools(storeCreator));

export { useStore, requestInitialState, formInitialState };
