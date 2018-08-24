export default class Controller {
  constructor(Reservation) {
    'ngInject';

    this.Reservation = Reservation;
    this.choose_number_of_persons_is_opened = false;

    this.$onChanges = () => {
      this.current_part = this.reservation.reservation_parts[this.currentIndex];
      this.current_tab_index = this.currentTabIndex;
    };
  }

  numberOfPersonsMoreThanTableSeats() {
    const generalNumberOfPersons =
      this.Reservation.generalNumberOfPersons(this.tables, this.current_part.tables);
    return this.current_part.number_of_persons > generalNumberOfPersons;
  }

  changeNumberOfPersonsInputPostProcess() {
    this.current_part.product = null;
    this.clearAndLoadTime();
  }

  changeNumberOfPersonsPostProcess() {
    this.changeNumberOfPersonsInputPostProcess();

    if (this.current_part.number_of_persons) {
      this.selectTab({ index: this.pagination.number_of_persons });
    }
  }

  changeIsGroupPostProcess() {
    this.reservation.reservation_parts = [this.current_part];
  }

  triggerChooseNumberOfPersons() {
    this.choose_number_of_persons_is_opened = !this.choose_number_of_persons_is_opened;
  }

  canShow() {
    return this.current_tab_index === this.pagination.number_of_persons - 1;
  }
}
