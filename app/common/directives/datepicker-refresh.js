function datepickerRefresh() {
  const noop = () => {};
  const refreshDpOnNotify = dpCtrl =>
    () => {
      dpCtrl.refreshView();
    };
  return {
    require: 'datepicker',
    link: (scope, elem, attrs, dpCtrl) => {
      const refreshPromise = scope[attrs.datepickerRefresh];
      refreshPromise.then(noop, noop, refreshDpOnNotify(dpCtrl));
    },
  };
}

export default datepickerRefresh;
