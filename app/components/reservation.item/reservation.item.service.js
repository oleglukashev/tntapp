import angular from 'angular';
import { getName } from '../../common/utils/name';

export default class ReservationItem {
  constructor(AppConstants, ReservationStatus, moment, $translate) {
    'ngInject';

    this.AppConstants = AppConstants;
    this.ReservationStatus = ReservationStatus;
    this.moment = moment;
    this.unknown_text = '';

    $translate('unknown').then((translate) => {
      this.unknown_text = translate;
    }, (translationIds) => {
      this.unknown_text = translationIds;
    });
  }

  prepareData(part, reservation, zones) {
    const lastName = reservation.customer.last_name;
    const firstName = reservation.customer.first_name;
    let name = getName(lastName, firstName);

    if (reservation.walk_in) {
      name = 'Walk in';
    } else if (!name) {
      name = this.unknown_text;
    }

    const icon = this.ReservationStatus.getIcon(part, reservation);

    return {
      id: part.id,
      icon_color: this.ReservationStatus.getIconColor(icon),
      dutch_status: this.AppConstants.reservationDutchStatuses[reservation.status],
      icon,
      product_name: part.product ? part.product.name : undefined,
      date_time: this.moment(part.date_time).format('DD.MM.YYYY HH:mm'),
      date: this.moment(part.date_time).format('DD.MM.YYYY'),
      time: this.moment(part.date_time).format('HH:mm'),
      number_of_persons: part.number_of_persons,
      table_ids: part.table_ids,
      table_numbers: part.table_numbers,
      tables_view: this.convertedTables(part.table_ids, part.table_numbers, zones),
      notes: reservation.notes.length > 80 ? `${reservation.notes.slice(0, 80)}...` : reservation.notes,
      customer: reservation.customer,
      customer_id: reservation.customer.id,
      name,
      reservation,
      part,
    };
  }

  convertedTables(tableIds, tableNumbers, zones) {
    if (!tableIds.length) {
      return '';
    }

    let result = [];
    const tablesByZone = {};
    const zoneIds = Object.keys(zones);

    tableIds.forEach((tableId, index) => {
      zoneIds.forEach((zoneId) => {
        const tableIds = zones[zoneId].tables.map(table => table.id);

        if (tableIds.includes(tableId)) {
          if (!tablesByZone[zoneId]) {
            tablesByZone[zoneId] = [];
          }

          const tableData = {
            id: tableId,
            number: tableNumbers[index],
          };

          tablesByZone[zoneId].push(tableData);
        }
      });
    });

    Object.keys(tablesByZone).forEach((zoneId) => {
      const sortedTablesByZone = tablesByZone[zoneId].map(tableData => tableData.id).sort();
      const sortedZonesTableIds = zones[zoneId].tables.map(table => table.id).sort();

      if (angular.equals(sortedTablesByZone, sortedZonesTableIds)) {
        result.push(zones[zoneId].name);
      } else {
        tablesByZone[zoneId].forEach((tableData) => {
          result = result.concat(tableData.number);
        });
      }
    });

    if (!result.length) {
      result = tableNumbers;
    }

    return result.join(', ');
  }
}
