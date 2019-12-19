const debounce = (fn, interval) => {
  let timer;
  let callback = fn;
  return (...args) => {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(context, args);
    }, interval);
  };
};

export { debounce };