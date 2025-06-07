import type { IOperations, ITicket } from '../../types/store';

/**
 * Prepares a new list by applying a series of operations to an existing list.
 *
 * This function takes the current list and an object of operations, and returns a new list
 * that reflects the applied operations. Operations can include creation, update, and deletion
 * of list items. The function processes the operations in the following order:
 *
 * 1. Removes items with IDs specified in delete operations.
 * 2. Updates items with corresponding IDs specified in update operations.
 * 3. Adds items specified in create operations.
 *
 * @param list - The current list of items.
 * @param operations - An object containing arrays of operations to be applied.
 *                              It should have keys 'create', 'update', and 'delete', each
 *                              containing an array of operations.
 * @returns - A new list of items after applying the operations.
 */

const prepareList = (list: Array<ITicket>, operations: IOperations) => {
  const flatOperations = Object.entries(operations).flatMap(
    (operationType: [string, Array<ITicket>]) =>
      operationType[1].map((operation) => ({
        ...operation,
        operationType: operationType[0],
      })),
  );
  const updates = flatOperations.filter(
    (operation) => operation.operationType === 'update',
  );
  const idsToDelete = flatOperations
    .filter((operation) => operation.operationType === 'delete')
    .map((item) => item.id);
  return [
    ...list
      // New list shouldn't have deleted items
      .filter((item) => !idsToDelete.includes(item.id))
      // New list should have updated items
      .map((item) => {
        const updatedItem = updates.find((upd) => upd.id === item.id);
        if (updatedItem) {
          const { operationType, ...rest } = updatedItem;
          return { ...item, ...rest };
        }
        return item;
      }),
    // New list should have created items
    ...flatOperations
      .filter((item) => item.operationType === 'create')
      .map((item) => {
        const { operationType, ...rest } = item;
        return { ...rest };
      }),
  ];
};

export { prepareList };
