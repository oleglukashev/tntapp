export default function AgendaItemFactory(AppConstants, ReservationStatus, $mdSidenav, $rootScope) {
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
        product_name: part.product ? part.product.name : undefined,
        time: instance.moment(part.date_time).format('HH:mm'),
        number_of_persons: part.number_of_persons,
        table_ids: part.table_ids.length ?
          instance.Table.getTableNumbersByTableIds(instance.tables, part.table_ids).join(', ') :
          [],
        notes: `${reservation.notes || ''}`,
        customer_id: reservation.customer.id,
        name,
        reservation,
        part,

        // graph calendar data:
        source_table_ids: part.table_ids,
        product_id: part.product ? part.product.id : undefined,
        reservation_id: reservation.id,
      };
    };

    instance.openCustomerMenu = (customerId, reservationPartId) => {
      if (customerId) {
        $rootScope.$broadcast('UserMenuCtrl.load_full_data', { customerId, reservationPartId });
        $mdSidenav('right').open();
      }
    };
  };
}
