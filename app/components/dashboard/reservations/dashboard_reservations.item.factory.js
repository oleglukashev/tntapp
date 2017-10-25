export default function DashboardReservationsItemFactory(AppConstants, ReservationStatus) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.rowPart = (part, reservation) => {
      if (!reservation.customer) {
        reservation.customer = {
          last_name: 'undefined',
        };
      }

      const name = reservation.customer.last_name ?
        `${reservation.customer.first_name} ${reservation.customer.last_name}` :
        reservation.customer.first_name;

      return {
        id: part.id,
        icon_color: ReservationStatus.getIconColor(part, reservation),
        dutch_status: AppConstants.reservationDutchStatuses[reservation.status],
        icon: ReservationStatus.getIcon(part, reservation),
        product_name: part.product.name,
        date_time: instance.moment(part.date_time).format('DD.MM.YYYY HH:mm'),
        number_of_persons: part.number_of_persons,
        table_ids: instance.Table.getTableNumbersByTableIds(instance.tables, part.table_ids).join(', '),
        notes: `${reservation.notes || ''}`,
        customer_id: reservation.customer.id,
        name,
        reservation,
      };
    };
  };
}
