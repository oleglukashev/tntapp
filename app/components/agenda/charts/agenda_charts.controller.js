export default class AgendaChartsCtrl {
  constructor(Charts, $scope, $state, ReservationPart) {
    'ngInject';

    this.$scope = $scope;
    this.$state = $state;
    this.Charts = Charts;
    this.ReservationPart = ReservationPart;

    this.data = {
      product: {},
      totalNumberOfPersons: 0,
    };

    this.$scope.$on('agenda.load_reservations', (e, reservations) => {
      reservations.forEach((reservation) => {
        if (reservation.status !== 'cancelled') {
          reservation.reservation_parts.forEach((part) => {
            const numberOfPersons = parseInt(part.number_of_persons, 10);

            if (!this.data.product[part.product.id]) {
              this.data.product[part.product.id] = {
                numberOfPersons: 0,
                name: part.product.name,
              };
            }

            this.data.product[part.product.id].numberOfPersons += numberOfPersons;
            this.data.totalNumberOfPersons += numberOfPersons;
          });
        }
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
