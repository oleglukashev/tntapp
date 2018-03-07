export default function NewReservationPersonFactory(Notification) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.additional_is_opened = false;

    instance.openDatepicker = () => {
      instance.opened = true;
    };

    instance.uploadImage = (file, errFiles) => {
      if (file) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (fileLoadedEvent) => {
          let srcData = fileLoadedEvent.target.result;
          srcData = srcData.replace(/data:application\/pdf;base64,/g, '');
          instance.reservation.reservation_pdf = srcData;
        };
      }

      if (errFiles && errFiles[0]) {
        Notification.setText(`${errFiles[0].$error} ${errFiles[0].$errorParam}`);
      }
    };

    instance.removePdf = ($event) => {
      $event.stopPropagation();
      instance.reservation.reservation_pdf = null;
    };

    instance.triggerAdditionalInfo = () => {
      instance.additional_is_opened = !instance.additional_is_opened;
    };

    instance.loadPDF = () => {
      const link = window.document.createElement('a');
      link.setAttribute('href', encodeURI('data:application/pdf;base64,' + instance.reservation.reservation_pdf));
      link.setAttribute('download', `reservation.pdf`);
      link.click();
    };

    instance.showAutocompleteCustomerName = () =>
      !instance.is_customer_reservation &&
      instance.settings &&
      instance.settings.suggest_customer_name;
  };
}
