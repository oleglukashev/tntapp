export default class Agenda {
  constructor(ReservationStatus, ReservationPart, Table, moment) {
    'ngInject';

    this.ReservationStatus = ReservationStatus;
    this.ReservationPart = ReservationPart;
    this.Table = Table;
    this.moment = moment;

    // generating array from 00 to 23
    this.hours = Array.from(Array(24).keys()).map((h) => {
      return (h < 10) ? `0${h.toString()}` : h.toString();
    });
  }

  getData(reservations, tables, zone) {
    const result = [];

    this.getPartsByZone(reservations, zone).forEach((part) => {
      const reservation = this.ReservationPart.reservationByPart(reservations, part);

      result.push({
        id: part.id,
        icon_color: this.ReservationStatus.getIconColor(reservation),
        icon: this.ReservationStatus.getIcon(reservation),
        product_name: part.product.name,
        general_date_time: this.generalDateTime(part),
        last_name: reservation.customer.last_name,
        first_name: reservation.customer.first_name,
        number_of_persons: part.number_of_persons,
        table_ids: this.Table.getTableNumbersByTableIds(tables, part.table_ids).join(', '),
        notes: `${reservation.notes || ''}`,
        customer_id: reservation.customer.id,
        reservation: reservation,
      });
    });

    return result;
  }

  getPartsByZone(reservations, zone) {
    const result = [];
    const parts = this.ReservationPart.partsByReservations(reservations);

    parts.forEach((part) => {
      part.table_ids.forEach((tableId) => {
        if (zone.table_ids.includes(tableId) && !result.includes(part)) {
          result.push(part);
        }
      });
    });

    return result;
  }

  generalDateTime(part) {
    if (part.start_date_time && part.end_date_time) {
      let str = `${this.moment(part.start_date_time).format('DD.MM.YYYY')}`;
      str += ` ${this.moment(part.start_date_time).format('HH:mm')} - ${this.moment(part.end_date_time).format('HH:mm')}`;
      return str;
    }

    return this.moment(part.date_time).format('DD.MM.YYYY HH:mm');
  }
}
