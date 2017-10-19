export default class NewReservation {
  constructor() {
    'ngInject';
  }

  validForm(reservation, phoneNumberIsRequired) {
    const errors = [];
    let prefix = '';

    reservation.reservation_parts.forEach((part, index) => {
      if (reservation.reservation_parts.length > 1) {
        prefix = `part ${index + 1}: `;
      }

      if (!part.date) errors.push(`${prefix}date is verplicht`);
      if (!part.number_of_persons) errors.push(`${prefix}number of persons is verplicht`);
      if (!part.time) errors.push(`${prefix}tijdstip is verplicht`);
      if (!part.product) errors.push(`${prefix}product is verplicht`);
    });

    if (!reservation.name) {
      errors.push('naam is verplicht');
    } else if (reservation.name.length < 2) {
      errors.push('naam niet vol');
    }

    if (!reservation.mail) errors.push('email adres is verplicht');
    if (phoneNumberIsRequired && !reservation.primary_phone_number) errors.push('telefoonnummer is verplciht');

    return errors;
  }
}
