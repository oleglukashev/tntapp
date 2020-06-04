export default class Controller {
  constructor() {
    'ngInject';

    this.$onChanges = () => {
      this.current_index = this.currentIndex;
      this.current_tab_index = this.currentTabIndex;

      const numberOfPersons = this.reservation
        .reservation_parts
        .map(item => item.number_of_persons || 0)
        .reduce((sum, item) => sum + item);

      this.reservation.prepayment_value = this.settings.prepayment_value || 0;
      if (this.settings.prepayment_type === 'per_person') {
        this.reservation.prepayment_value = this.reservation.prepayment_value * numberOfPersons;
      }

      // + 1 for fee
      if (this.reservation.prepayment_value) {
        this.reservation.prepayment_value += 1;
        this.reservation.prepayment_value = Math.round((this.reservation.prepayment_value + Number.EPSILON) * 100) / 100;
      }
    };
  }
}
