export default class AnalyticsCtrl {
  constructor(User, Analytics, AppConstants, Charts, Product, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Analytics = Analytics;
    this.Product = Product;
    this.Charts = Charts;
    this.AppConstants = AppConstants;
    this.$rootScope = $rootScope;

    this.loadAnalytics();
    this.loadProducts();

    this.average_guests_per_day_type = 'month';

    this.barColors = [{
      backgroundColor: this.AppConstants.chartColors.orange,
      borderColor: this.AppConstants.chartColors.orange,
    }];

    this.totalAmountOfGuestsDatasetOverride = [{
      type: 'bar',
    }, {
      type: 'bar',
    }, {
      type: 'line',
    }];
  }

  loadAnalytics() {
    this.$rootScope.show_spinner = true;

    this.Analytics.getAll(this.current_company_id).then((result) => {
      this.analyticsData = result;
      this.$rootScope.show_spinner = false;
    }, () => {
      this.$rootScope.show_spinner = false;
    });
  }

  loadProducts() {
    this.Product.getAll(this.current_company_id).then((products) => {
      this.products = products;
    });
  }

  updateAverageGuestsPerDayType(type) {
    this.average_guests_per_day_type = type;
    this.loadAverageGuestsPerDayProcess();
  }

  updateAverageGuestsPerDayProduct() {
    this.loadAverageGuestsPerDayProcess();
  }

  updateTotalAmountOfGuestsProduct() {
    this.loadTotalAmountOfGuestsProcess();
  }

  loadAverageGuestsPerDayProcess() {
    this.$rootScope.show_spinner = true;
    const data = {
      groupby: this.average_guests_per_day_type,
    };

    if (this.average_guests_per_day_product) {
      data.perproduct = this.average_guests_per_day_product.id;
    }

    this.Analytics.getAverageGuestsPerDay(this.current_company_id, data)
      .then((result) => {
        this.analyticsData.getAverageGuestsPerDay = result;
        this.$rootScope.show_spinner = false;
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }

  loadTotalAmountOfGuestsProcess() {
    this.$rootScope.show_spinner = true;
    const data = {
      groupby: 'month',
    };

    if (this.total_amount_of_guests_product) {
      data.perproduct = this.total_amount_of_guests_product.id;
    }

    this.Analytics.getTotalAmountOfGuests(this.current_company_id, data)
      .then((result) => {
        this.analyticsData.getTotalAmountOfGuests = result;
        this.$rootScope.show_spinner = false;
      }, () => {
        this.$rootScope.show_spinner = false;
      });
  }
}
