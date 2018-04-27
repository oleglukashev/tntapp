export default class UserMenu {
  constructor(Customer) {
    'ngInject';

    this.Customer = Customer;
    this.clearData();
  }

  setData(data) {
    this.reservations = data.reservations;
    this.ls_reservations = data.ls_reservations;
    this.notes = data.notes;
    this.allergies = data.allergies;
    this.preferences = data.preferences;
    this.customer = data.customer;
    this.current_part = data.current_part;
    this.current_reservation = data.current_reservation;
  }

  loadAndSetFullData(currentCompanyId, customerId, reservationPartId) {
    this.Customer.searchReservationsByCustomerId(currentCompanyId, customerId)
      .then((response) => {
        this.clearData();

        const data = {
          reservations: response.reservations,
          ls_reservations: response.ls_reservations,
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
    this.ls_reservations = [];
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
