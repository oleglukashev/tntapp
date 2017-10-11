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

      if (!part.date) errors.push(`${prefix}DATE not found`);
      if (!part.number_of_persons) errors.push(`${prefix}NUMBER OF PERSONS not found`);
      if (!part.time) errors.push(`${prefix}TIJDSTIP not found`);
      if (!part.product) errors.push(`${prefix}PRODUCT not found`);
    });

    if (!reservation.name) errors.push('VOOR- EN ACHTERNAAM not found');
    if (!reservation.mail) errors.push('MAIL not found');
    if (phoneNumberIsRequired && !reservation.primary_phone_number) errors.push('TELEFOONNUMMER not found');

    return errors;
  }
}
