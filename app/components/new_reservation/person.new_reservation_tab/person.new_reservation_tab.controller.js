export default class Controller {
  constructor(AppConstants, Notification) {
    'ngInject';

    this.AppConstants = AppConstants;
    this.Notification = Notification;
    this.additional_is_opened = false;

    this.$onChanges = () => {
      this.current_index = this.currentIndex;
      this.current_part = this.reservation.reservation_parts[this.current_index];
      this.current_tab_index = this.currentTabIndex;
      this.current_company_id = this.currentCompanyId;
      this.allergy_data = this.allergyData;
      this.preference_data = this.preferenceData;
    };
  }

  openDatepicker() {
    this.opened = true;
  }

  uploadImage(file, errFiles) {
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (fileLoadedEvent) => {
        let srcData = fileLoadedEvent.target.result;
        srcData = srcData.replace(/data:application\/pdf;base64,/g, '');
        this.reservation.reservation_pdf = srcData;
      };
    }

    if (errFiles && errFiles[0]) {
      this.Notification.setText(`${errFiles[0].$error} ${errFiles[0].$errorParam}`);
    }
  }

  removePdf($event) {
    $event.stopPropagation();
    this.reservation.reservation_pdf = null;
  }

  triggerAdditionalInfo() {
    this.additional_is_opened = !this.additional_is_opened;
  }

  loadPDF() {
    const link = window.document.createElement('a');
    link.setAttribute('href', encodeURI('data:application/pdf;base64,' + this.reservation.reservation_pdf));
    link.setAttribute('download', 'reservation.pdf');
    link.click();
  }

  showAutocompleteCustomerName() {
    return this.type !== 'customer' && this.settings && this.settings.suggest_customer_name;
  }

  canShow() {
    return this.current_tab_index === this.pagination.person - 1;
  }
}
