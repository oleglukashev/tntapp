export default class SettingsProductsNewProductCtrl {
  constructor(User, TimeRange, prosucts_used, products, $timeout, $rootScope, $scope, $modalInstance) {
    'ngInject';

    this.current_company = User.current_company;

    this.User             = User;
    this.prosucts_used        = prosucts_used;
    this.products         = products;
    this.tab_index        = 0;
    this.$timeout         = $timeout;
    this.$rootScope       = $rootScope;
    this.$scope           = $scope;
    this.default_products = ['Lunch', 'Brunch', 'Ontbijt', 'Diner', 'Borrel'];

    this.sliderMonFri = {
        minValue: 1,
        maxValue: 96,
    };

    this.sliderSat = {
        minValue: 1,
        maxValue: 96,
    };

    this.sliderSun = {
        minValue: 1,
        maxValue: 96,
    };
    this.sliders = [
      {
        name   : 'Maandag t/m vrijdag',
        slider : this.sliderMonFri
      },
      {
        name   : 'Zaterdag',
        slider : this.sliderSat
      },
      {
        name   : 'Zondag',
        slider : this.sliderSun
      },
    ];
    this.icons_classes    = {
      'Lunch'   : 'mdi-silverware-variant',
      'Brunch'  : 'mdi-martini',
      'Ontbijt' : 'mdi-food-fork-drink',
      'Diner'   : 'mdi-beach',
      'Borrel'  : 'mdi-food-fork-drink'
    }
    this.$modalInstance = $modalInstance;

    // $scope.$on("slideEnded", function() {
    // });

    this.sliderOptions = {
      floor: 1,
      ceil: 96,
      step: 1,
      minRange: 1,
      pushRange: true,
      draggableRange: true,
      noSwitching: true,
      hideLimitLabels: true,
      translate: (val) => {
        let min = '00';
        switch(val % 4) {
          case 1: {
            min = '15'
            break;
          }
          case 2: {
            min = '30'
            break;
          }
          case 3: {
            min = '45'
            break;
          }
        }
        return Math.floor(val/4) + ':' + min;
      },
    };

    this.redrawSliders();
  }

  to15Min(time, round=true) {
    let arr = time.split(':');
    return arr[0]*4 + (round ? Math.round(arr[1]/15) : Math.floor(arr[1]/15)) || 1;
  }

  from15Min(min15) {
    let hours = this.to2Digits(Math.floor(min15/4));
    let mins  = this.to2Digits((min15%4)*15);
    return [hours,mins].join(':');
  }

  to2Digits(dig) {
    return (dig < 10 ? '0' : '') + dig
  }

  redrawSliders() {
    // force redraw slider after loading
    this.$timeout(() => {
      this.$rootScope.$broadcast('rzSliderForceRender');
    });
  }

  selectProduct() {
    this.sliderOptions.minLimit = 1;
    this.sliderOptions.maxLimit = 96;

    this.products.map((product) => {
      if (this.item.name == product.name) {
        let startTime = this.to15Min('00:00'); //product.start_time
        let endTime = this.to15Min('23:59', false); //product.end_time

        // this.sliderOptions.minLimit = startTime;
        // this.sliderOptions.maxLimit = endTime;

        this.sliderMonFri.minValue = startTime;
        this.sliderMonFri.maxValue = endTime;
        this.sliderSat.minValue = startTime;
        this.sliderSat.maxValue = endTime;
        this.sliderSun.minValue = startTime;
        this.sliderSun.maxValue = endTime;
      }
    });
  }

  closeModal() {
    this.$modalInstance.close();
  }

  submitForm() {
    this.is_submitting = true;
    this.errors        = [];
    this.$modalInstance.close({
      productName : this.item.name,
      sliderMonFri: this.sliderMonFri,
      sliderSat   : this.sliderSat,
      sliderSun   : this.sliderSun
    });
  }

  productsUsed() {
 
 
    return res;
  }
}