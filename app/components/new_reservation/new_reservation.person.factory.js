import angular from 'angular';

export default function NewReservationPersonFactory() {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.additional_is_opened = false;

    instance.openDatepicker = () => {
      instance.opened = true;
    };

    instance.removePdf = ($event) => {
      $event.stopPropagation();
      instance.reservation.reservation_pdf = null;
    };

    instance.triggerAdditionalInfo = () => {
      instance.additional_is_opened = !instance.additional_is_opened;
    };

    instance.loadPDF = () => {
      const file = instance.reservation.reservation_pdf;

      if (typeof file !== 'object') return false;

      const url = (window.URL || window.webkitURL).createObjectURL(file);
      const link = window.document.createElement('a');
      link.setAttribute('href', encodeURI(url));
      link.setAttribute('download', `${file.name}`);
      link.click();
    };

    instance.showAutocompleteCustomerName = () =>
      !instance.is_customer_reservation &&
      instance.settings &&
      instance.settings.suggest_customer_name;
  };
}
