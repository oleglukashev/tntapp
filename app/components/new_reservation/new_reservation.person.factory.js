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
      const anchor = angular.element('<a/>');
      anchor.attr({
        href: url,
        target: '_blank',
        download: `${file.name}`,
      })[0].click();
    };

    instance.showAutocompleteCustomerName = () =>
      !instance.is_customer_reservation &&
      instance.settings &&
      instance.settings.suggest_customer_name;
  };
}
