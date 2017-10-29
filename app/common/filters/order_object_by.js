import angular from 'angular';

export default angular.module('app.filters', [])
  .filter('orderObjectBy', () =>
    (items, field, reverse) => {
      const filtered = [];
      angular.forEach(items, (item) => {
        filtered.push(item);
      });
      filtered.sort((a, b) => (a[field] > b[field] ? 1 : -1));
      if (reverse) filtered.reverse();
      return filtered;
    })
  .name;
