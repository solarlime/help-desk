/**
 * Returns current date and time as a string in Russian locale (like "20.01.2022, 13:00)".
 *
 */
const resolveDate = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
  };
  return now.toLocaleString('ru', options);
};

export { resolveDate };
