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
