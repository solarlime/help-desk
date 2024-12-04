const resolveDate = () => {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
  };
  return now.toLocaleString('ru', options);
};

export { resolveDate };
