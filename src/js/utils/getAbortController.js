/**
 * Creates a function that returns a new AbortController instance.
 *
 * The returned function sets up an event listener on the abort signal of the
 * AbortController. When the signal is aborted, the listener will remove itself
 * and create a new AbortController instance, ensuring that the returned
 * AbortController is always in a non-aborted state.
 *
 * @returns {function} A function that returns a fresh AbortController instance.
 */
function makeAbortController() {
  let abortController = new AbortController();
  return function () {
    const abortHandler = () => {
      abortController.signal.removeEventListener('abort', abortHandler);
      abortController = new AbortController();
    };
    abortController.signal.addEventListener('abort', abortHandler);
    return abortController;
  };
}

const getAbortController = makeAbortController();

export { getAbortController };
