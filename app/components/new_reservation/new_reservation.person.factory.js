export default function NewReservationPersonFactory() {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.additional_is_opened = false;

    instance.openDatepicker = () => {
      instance.opened = true;
    };

    instance.removePdf = () => {
      instance.reservation.reservation_pdf = null;
    };

    instance.triggerAdditionalInfo = () => {
      instance.additional_is_opened = !instance.additional_is_opened;
    };

    instance.showAutocompleteCustomerName = () =>
      !instance.is_customer_reservation &&
      instance.settings &&
      instance.settings.suggest_customer_name;
  };
}
