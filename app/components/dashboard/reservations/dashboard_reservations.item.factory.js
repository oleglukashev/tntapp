export default function DashboardReservationsItemFactory() {
  return (that) => {
    that.rowPart = (part, reservation) => {
      return {
        id: part.id,
        icon_color: that.ReservationStatus.getIconColor(reservation),
        icon: that.ReservationStatus.getIcon(reservation),
        product_name: part.product.name,
        date_time: that.moment(part.date_time).format('DD.MM.YYYY HH:mm'),
        last_name: reservation.customer.last_name,
        first_name: reservation.customer.first_name,
        number_of_persons: part.number_of_persons,
        table_ids: that.Table.getTableNumbersByTableIds(that.tables, part.table_ids).join(', '),
        notes: `${reservation.notes || ''}`,
        customer_id: reservation.customer.id,
        reservation: reservation,
      };
    };
  };
}
