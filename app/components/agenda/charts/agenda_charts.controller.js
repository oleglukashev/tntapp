export default class AgendaChartsCtrl {
  constructor(Charts, moment, $scope, $state, ReservationPart) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.moment = moment;
    this.Charts = Charts;
    this.ReservationPart = ReservationPart;

    this.$scope.$on('agenda.load_reservations_data_and_date_filter', (e, data) => {
      this.data = {
        product: {},
        totalNumberOfPersons: 0,
      };

      data.reservations_data.forEach((item) => {
        const numberOfPersons = parseInt(item.number_of_persons, 10);

        if (!this.data.product[item.product_id]) {
          this.data.product[item.product_id] = {
            numberOfPersons: 0,
            name: item.product_name,
          };
        }

        this.data.product[item.product_id].numberOfPersons += numberOfPersons;
        this.data.totalNumberOfPersons += numberOfPersons;
      });

      this.data.product[0] = {
        numberOfPersons: this.data.totalNumberOfPersons,
        name: 'Totaal',
      };
    });
  }

  showReservations(productId) {
    const params = productId > 0 ? { productId } : {};
    this.$state.go('app.reservations', params);
  }
}
