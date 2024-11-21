export default function validation(input) {
  const message = input.nextElementSibling;
  if (message) {
    if (!input.validity.valid || !input.value.trim()) {
      if (input.id !== 'title') {
        message.classList.add('hidden');
        return true;
      }
      if (input.validity.valueMissing) {
        message.textContent = 'You need to fill the title in';
      } else {
        message.textContent = 'This value is invalid';
      }
      message.classList.remove('hidden');
      return false;
    }
    message.classList.add('hidden');
  }
  return true;
}

const isValidName = (value) => /^[А-Яа-яËё. A-Za-z0-9]*$/.test(value);

export { isValidName };
