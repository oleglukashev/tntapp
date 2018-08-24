import template from './dashboard.charts.rating.directive.view.html';

class chartRating {
  constructor() {
    this.template = template;
    this.restrict = 'E';
    this.scope = {
      rating: '=tnrrating',
    };

    this.link = (scope) => {
      scope.rating = scope.rating || 0;
      scope.result = '';

      for (let i = 1; i <= 5; i += 1) {
        if (i <= Math.floor(parseFloat(scope.rating)))
          scope.result += '<i class="mdi mdi-star"></i>';
        else if (parseFloat(scope.rating) % 1 > 0 &&
          i === Math.floor(parseFloat(scope.rating)) + 1)
          scope.result += '<i class="mdi mdi-star-half"></i>';
        else
          scope.result += '<i class="mdi mdi-star-outline"></i>';
      }
    };
  }
}

export default chartRating;
