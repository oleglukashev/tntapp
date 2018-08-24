export default class AgendaChartsCtrl {
  constructor(Charts, moment, $scope, $state, ReservationPart, $translate) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.moment = moment;
    this.Charts = Charts;
    this.ReservationPart = ReservationPart;
    this.total_label = 'Total';

    this.$scope.$on('agenda.load_reservations_data_and_date_filter', (e, data) => {
      this.data = {
        product: {},
        totalNumberOfPersons: 0,
      };

      data.reservations_data.forEach((item) => {
        const numberOfPersons = parseInt(item.number_of_persons, 10);
        const productId = item.part.product ? item.part.product.id : null;

        if (!this.data.product[productId]) {
          this.data.product[productId] = {
            numberOfPersons: 0,
            name: item.product_name,
          };
        }

        this.data.product[productId].numberOfPersons += numberOfPersons;
        this.data.totalNumberOfPersons += numberOfPersons;
      });

      this.data.product[0] = {
        numberOfPersons: this.data.totalNumberOfPersons,
        name: this.total_label,
      };
    });

    // run translates
    $translate('total').then((total) => {
      this.total_label = total;
    }, (translationIds) => {
      this.total_label = translationIds;
    });
  }

  showReservations(productId) {
    const params = productId > 0 ? { productId } : {};
    this.$state.go('app.reservations', params);
  }
}
