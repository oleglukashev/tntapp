export default class NewReservation {
  constructor($translate) {
    'ngInject';

    this.$translate = $translate;

    // run translates
    const translatesArray = [
      'date',
      'product',
      'number_of_guests',
      'first_name',
      'notifications.not_full',
      'email',
      'last_name',
      'phone', 
      'notifications.is_required',
      'time',
      'notifications.full_name',
      'notifications.not_valid',
      'corona_confirmation',
    ];

    $translate(translatesArray).then((translates) => {
      this.date_text = translates.date;
      this.product_text = translates.product;
      this.number_of_guests_text = translates.number_of_guests;
      this.first_name_text = translates.first_name;
      this.last_name_text = translates.last_name;
      this.phone_text = translates.phone;
      this.email_text = translates.email;
      this.is_required_text = translates['notifications.is_required'];
      this.time_text = translates.time;
      this.full_name_text = translates['notifications.full_name'];
      this.not_full_text = translates['notifications.not_full'];
      this.not_valid = translates['notifications.not_valid'];
      this.corona_confirmation_text = translates.corona_confirmation;
    }, (translationIds) => {
      this.date_text = translationIds.date;
      this.product_text = translationIds.product;
      this.number_of_guests_text = translationIds.number_of_guests;
      this.first_name_text = translationIds.first_name;
      this.last_name_text = translationIds.last_name;
      this.phone_text = translationIds.phone;
      this.email_text = translationIds.email;
      this.is_required_text = translationIds['notifications.is_required'];
      this.time_text = translationIds.time;
      this.full_name_text = translationIds['notifications.full_name'];
      this.not_full_text = translationIds['notifications.not_full'];
      this.not_valid = translationIds['notifications.not_valid'];
      this.corona_confirmation_text = translationIds.corona_confirmation;
    });
  }

  validForm(reservation, phoneNumberIsRequired, isCustomerReservation, walkIn, form) {
    const errors = [];
    let prefix = '';
    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    reservation.reservation_parts.forEach((part, index) => {
      if (reservation.reservation_parts.length > 1) {
        prefix = `part ${index + 1}: `;
      }

      if (!part.number_of_persons) errors.push(`${prefix}${this.number_of_guests_text} ${this.is_required_text}`);

      if (!walkIn) {
        if (!part.date) errors.push(`${prefix}${this.date_text} ${this.is_required_text}`);
        if (!part.time) errors.push(`${prefix}${this.time_text} ${this.is_required_text}`);
        if (!part.product) errors.push(`${prefix}${this.product_text} ${this.is_required_text}`);
      }
    });

    if (!walkIn) {
      if (isCustomerReservation) {
        if (!reservation.last_name) errors.push(`${this.last_name_text} ${this.is_required_text}`);
        if (!reservation.first_name) errors.push(`${this.first_name_text} ${this.is_required_text}`);
      } else if (!reservation.last_name && !reservation.first_name) {
        errors.push(this.full_name_text);
      }

      if (!reservation.mail && isCustomerReservation) {
        errors.push(`${this.email_text} ${this.is_required_text}`);
      } else if (reservation.mail && !emailRe.test(reservation.mail)) {
        errors.push(`${this.email_text} ${this.not_full_text}`);
      }

      if (phoneNumberIsRequired && !reservation.primary_phone_number) errors.push(`${this.phone_text} ${this.is_required_text}`);
    }

    if (!reservation.corona_confirmation) {
      errors.push(`${this.corona_confirmation_text} ${this.is_required_text}`);
    }

    if (form && form.$error && form.$error.phoneValid) {
      errors.push(`${this.phone_text} ${this.not_valid}`);
    }

    return errors;
  }
}
