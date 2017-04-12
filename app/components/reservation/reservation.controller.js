export default class ReservationCtrl {
  constructor(Upload, Reservation, $scope, $window, $modalInstance) {
    'ngInject';

    this.Upload               = Upload;
    this.Reservation          = Reservation;
    this.$scope               = $scope;
    this.$window              = $window;
    this.$modalInstance       = $modalInstance;

    this.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      showWeeks: false,
      class: 'datepicker'
    };

    this.initDate             = new Date();
    this.format               = 'dd-MMMM-yyyy';

    this.new_reservation = {
      number_of_persons: undefined,
      time: undefined,
      language: 'Nederlands',
      gender: 1
    };
    this.additional_is_opened = false;
    this.success              = false;
  }

  triggerAdditionalInfo() {
    this.additional_is_opened = !this.additional_is_opened;
  }

  sendForm() {
    this.success = true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  openDatepicker() {
    this.opened = true;
  }
}
