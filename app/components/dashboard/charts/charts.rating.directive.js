import template from './charts.rating.directive.view.html';

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
      for (let i = 0; i < Math.floor(parseFloat(scope.rating)); i += 1) {
        scope.result += '<i class="mdi mdi-star"></i>';
      }

      if (parseFloat(scope.rating) % 1 > 0) {
        scope.result += '<i class="mdi mdi-star-half"></i>';
      }
    };
  }
}

export default chartRating;
