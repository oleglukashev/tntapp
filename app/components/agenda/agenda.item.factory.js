export default function AgendaItemFactory(AppConstants) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.rowPart = (part, reservation) => {
      return {
        id: part.id,
        icon_color: instance.ReservationStatus.getIconColor(part, reservation),
        dutch_status: AppConstants.reservationStatuses[reservation.status],
        icon: instance.ReservationStatus.getIcon(part, reservation),
        product_name: part.product.name,
        date_time: instance.moment(part.date_time).format('DD.MM.YYYY HH:mm'),
        last_name: reservation.customer.last_name,
        first_name: reservation.customer.first_name,
        number_of_persons: part.number_of_persons,
        table_ids: instance.Table.getTableNumbersByTableIds(instance.tables, part.table_ids).join(', '),
        notes: `${reservation.notes || ''}`,
        customer_id: reservation.customer.id,
        reservation,
      };
    };
  };
}
