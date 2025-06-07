export type TViewMode = 'all' | 'active' | 'done';

export type TQuantities = {
  [key in TViewMode]: number;
};
