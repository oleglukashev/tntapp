export default function modalOptionsFactory() {
  return (options, canClose) => {
    options.size = 'md';

    if (canClose !== true) {
      options.backdrop = 'static';
      options.keyboard = false;
    }

    return options;
  };
}
