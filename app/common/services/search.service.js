import angular from 'angular';

export default class Search {
  constructor(User, $http, $q) {
    'ngInject';

    this.$http           = $http;
    this.$q              = $q;
    this.currentUser     = User.current;
    this.current_company = User.current_company;
  }

  // Relevation sort functions for search results:

  similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    let startPosition = 0;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }

    let reg = new RegExp("^" + s2, "i");
    if (reg.test(s1)) startPosition = 1;
    return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength) + startPosition;
  }

  editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  compare(query, that) {
    return function(a, b) {
      if (that.similarity(a.display, query) > that.similarity(b.display, query))
        return -1;
      if (that.similarity(a.display, query) < that.similarity(b.display, query))
        return 1;
      return 0;
    }
  }

}