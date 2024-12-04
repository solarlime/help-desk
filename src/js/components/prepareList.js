const prepareList = (list, operations) => {
  const flatOperations = Object.entries(operations).flatMap((operationType) =>
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
    ...flatOperations.filter((item) => item.operationType === 'create'),
  ];
};

export { prepareList };
