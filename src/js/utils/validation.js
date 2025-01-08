/**
 * Checks whether a given string is a valid title for a ticket.
 *
 * @param {string} value - The string to check.
 * @returns {boolean} Whether the string is valid.
 *
 * A valid title is a string that contains only Latin and Cyrillic letters,
 * numbers, spaces, and dots. The string must not be empty.
 *
 * Examples:
 *   isValidName('My Ticket'); // true
 *   isValidName('My Ticket '); // false
 *   isValidName(' my ticket'); // false
 *   isValidName(''); // false
 *   isValidName('   '); // false
 */
const isValidName = (value) => /^[А-Яа-яËё. A-Za-z0-9]*$/.test(value);

export { isValidName };
