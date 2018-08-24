import angular from 'angular';

export default class UserMenu {
  constructor(User, Customer) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();
    this.Customer = Customer;
    this.clearData();
  }

  setData(data) {
    this.reservations = data.reservations;
    this.integration_reservations = data.integration_reservations;
    this.notes = data.notes;
    this.allergies = data.allergies;
    this.preferences = data.preferences;
    this.customer = data.customer;
    this.current_part = data.current_part;
    this.current_reservation = data.current_reservation;
  }

  loadAndSetFullData(customerId, reservationPartId) {
    this.Customer.searchReservationsByCustomerId(this.currentCompanyId, customerId)
      .then((response) => {
        this.clearData();

        const data = {
          reservations: response.reservations,
          integration_reservations: response.integration_reservations,
          notes: response.notes,
          allergies: response.allergies,
          preferences: response.preferences,
          customer: response.customer,
        };

        response.reservations.forEach((reservation) => {
          reservation.reservation_parts.forEach((part) => {
            if (part.id === reservationPartId) {
              data.current_part = part;
              data.current_reservation = reservation;
            }
          });
        });

        this.setData(data);
      });
  }

  clearData() {
    this.reservations = [];
    this.integration_reservations = [];
    this.notes = [];
    this.allergies = [];
    this.preferences = [];
    this.customer = null;
    this.current_part = null;
    this.current_reservation = null;
  }

  isCurrentCustomer(customerId) {
    return this.customer && parseInt(this.customer.id) === customerId;
  }
}
