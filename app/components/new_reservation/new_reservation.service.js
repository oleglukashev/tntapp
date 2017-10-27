export default class NewReservation {
  constructor() {
    'ngInject';
  }

  validForm(reservation, phoneNumberIsRequired, walkIn) {
    const errors = [];
    let prefix = '';
    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    reservation.reservation_parts.forEach((part, index) => {
      if (reservation.reservation_parts.length > 1) {
        prefix = `part ${index + 1}: `;
      }

      if (!part.number_of_persons) errors.push(`${prefix}number of persons is verplicht`);

      if (!walkIn) {
        if (!part.date) errors.push(`${prefix}date is verplicht`);
        if (!part.time) errors.push(`${prefix}tijdstip is verplicht`);
        if (!part.product) errors.push(`${prefix}product is verplicht`);
      }
    });

    if (!reservation.last_name) errors.push('achternaam is verplicht');
    if (!reservation.first_name) errors.push('voornaam is verplicht');

    if (!reservation.mail) {
      errors.push('email adres is verplicht');
    } else if (!emailRe.test(reservation.mail)) {
      errors.push('email adres niet vol');
    }

    if (phoneNumberIsRequired && !reservation.primary_phone_number) errors.push('telefoonnummer is verplciht');

    return errors;
  }
}
