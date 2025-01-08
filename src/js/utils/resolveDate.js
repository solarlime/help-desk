/**
 * Returns current date and time as a string in Russian locale.
 *
 * @returns {string} - A string like "20.01.2022, 13:00" in Russian locale.
 */
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
