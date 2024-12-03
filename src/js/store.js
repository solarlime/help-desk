import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const formInitialState = {
  form: {
    initialName: '',
    initialDescription: '',
    name: '',
    description: '',
    canSubmit: false,
  },
};

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

export const storeCreator = (...a) => ({
  ...createFormSlice(...a),
});

const useStore = create()(devtools(storeCreator));

export { useStore };
