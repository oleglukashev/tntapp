export default class Controller {
  constructor(ReservationPart, moment) {
    'ngInject';

    this.ReservationPart = ReservationPart;
    this.moment = moment;

    this.$onChanges = () => {
      this.current_part = this.reservation.reservation_parts[this.currentIndex];
      this.current_index = this.currentIndex;
      this.current_tab_index = this.currentTabIndex;
    };
  }

  addPart() {
    const newPart = this.ReservationPart.getNewReservationPart();
    newPart.date = new Date();
    this.reservation.reservation_parts.push(newPart);
  }

  removePart(e, index) {
    e.stopPropagation();

    if (this.reservation.reservation_parts.length > 1) {
      this.reservation.reservation_parts.splice(index, 1);
      this.selectCurrentIndex({ index: 0 });
      this.current_part = this.reservation.reservation_parts[0];
    }
  }

  namesOfTables(part) {
    if (!part.tables) {
      return '';
    }

    return part.tables.map(table => table.table_number).join(', ');
  }

  canShow() {
    return this.current_tab_index === this.pagination.group - 1;
  }

  changeRepeat() {
    if (this.reservation.repeat) {
      this.reservation.repeat_type = 'daily';
    }
  }
}
