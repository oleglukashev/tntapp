import angular from 'angular';

export default function ReservationItemFactory(AppConstants, ReservationStatus, $mdSidenav,
  $rootScope, $translate) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.rowPart = (part, reservation) => {
      const lastName = reservation.customer.last_name;
      const firstName = reservation.customer.first_name;
      let name = instance.getName(lastName, firstName);

      if (reservation.walk_in) {
        name = 'Walk in';
      } else if (!name) {
        name = instance.unknown_text;
      }

      return {
        id: part.id,
        icon_color: ReservationStatus.getIconColor(part, reservation),
        dutch_status: AppConstants.reservationDutchStatuses[reservation.status],
        icon: ReservationStatus.getIcon(part, reservation),
        product_name: part.product ? part.product.name : undefined,
        date_time: instance.moment(part.date_time).format('DD.MM.YYYY HH:mm'),
        date: instance.moment(part.date_time).format('DD.MM.YYYY'),
        time: instance.moment(part.date_time).format('HH:mm'),
        number_of_persons: part.number_of_persons,
        table_ids: part.table_ids.length ?
          instance.Table.getTableNumbersByTableIds(Object.values(instance.tables), part.table_ids).join(', ') :
          [],
        tables: instance.convertedTables(part.table_ids),
        notes: `${reservation.notes || ''}`,
        customer: reservation.customer,
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

    instance.convertedTables = (tableIds) => {
      let result = [];
      const tablesByZone = {};

      tableIds.forEach((tableId) => {
        const table = instance.tables[tableId];
        if (table) {
          table.zones.forEach((zoneId) => {
            if (!tablesByZone[zoneId]) {
              tablesByZone[zoneId] = [];
            }

            tablesByZone[zoneId].push(tableId);
          });
        }
      });

      Object.keys(tablesByZone).forEach((zoneId) => {
        const sortedTablesByZone = tablesByZone[zoneId].sort();
        const sortedZonesTableIds = instance.zones[zoneId].table_ids.sort();

        if (angular.equals(sortedTablesByZone, sortedZonesTableIds)) {
          result.push(instance.zones[zoneId].name);
        } else {
          tablesByZone[zoneId].forEach((tableId) => {
            result = result.concat(instance.tables[tableId].table_number);
          });
        }
      });

      return result.join(', ');
    };

    instance.openCustomerMenu = (customerId, reservationPartId) => {
      if (customerId) {
        $rootScope.$broadcast('UserMenuCtrl.load_full_data', { customerId, reservationPartId });
        $mdSidenav('right').open();
      }
    };

    instance.getName = (lastName, firstName) => {
      if (lastName && firstName) {
        return `${lastName} ${firstName}`;
      } else if (lastName) {
        return lastName;
      }

      return firstName;
    };

    $translate('unknown').then((translate) => {
      instance.unknown_text = translate;
    }, (translationIds) => {
      instance.unknown_text = translationIds;
    });
  };
}
