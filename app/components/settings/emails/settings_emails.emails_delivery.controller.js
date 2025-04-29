import cronstrue from 'cronstrue';

export default class Controller {
  constructor(User, emails_deliveries, moment, item, EmailsDelivery, $uibModalInstance, $rootScope) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.moment = moment;
    this.EmailsDelivery = EmailsDelivery;
    this.$modalInstance = $uibModalInstance;
    this.$rootScope = $rootScope;
    this.emails_deliveries = emails_deliveries;
    this.recipient_conditions = [
      'birthday',
      'all',
      'newsletter_subscribers',
      'reservation_label_wedding',
      'reservation_label_promotion',
      'reservation_label_party',
      'reservation_label_drinks',
      'reservation_label_condolence',
      'reservation_label_company_outing',
    ];
    this.item = Object.assign({}, item);
    this.hours = [
      '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00',
      '10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00',
      '20:00','21:00','22:00','23:00'
    ];
    this.months = Array.from({length: 12}, (_, i) => i + 1);
    this.days = Array.from({length: 31}, (_, i) => i + 1);
    this.weeks = Array.from({length: 10}, (_, i) => i + 1);
    this.sending_type_periodically_number_collection = this.months;
    this.sending_type_periodically_period_collection = ['months', 'weeks', 'days', 'years'];
    this.start_sending_at_date_from_details_period_collection = ['before', 'after'];
    this.form_data = {
      sending_type: item ? item.sending_type : 'periodically',
      start_sending_at_type: item ? item.start_sending_at_type : 'date_from_details',
      start_sending_at_hour: item ? this.moment(item.start_sending_at).format('HH:mm') : this.hours[0],
      start_sending_at_date: item ? this.moment(item.start_sending_at).toDate() : this.moment().toDate(),

      start_sending_at_date_from_details_days: item ?
        item.start_sending_at_date_from_details_days :
        this.days[0],
      start_sending_at_date_from_details_period: item ?
        item.start_sending_at_date_from_details_period :
        this.start_sending_at_date_from_details_period_collection[0],

      sending_type_periodically_number: item ?
        item.sending_type_periodically_number :
        this.sending_type_periodically_number_collection[0],
      sending_type_periodically_period: item ?
        item.sending_type_periodically_period :
        this.sending_type_periodically_period_collection[0],

      //cron: item ? item.cron : '0 0 1 * *',
      enabled: item ? item.enabled : true,
      recipient_condition: item ? item.recipient_condition : this.recipient_conditions[0],
      title: item ? item.title : null,
      content: item ? item.content : null,
    };
    this.cronDescription = 'Every minute';
    this.updateCronDescription();
    this.editorUrl = this.EmailsDelivery.editorUrl(this.current_company_id, item ? item.id : null);
  }

  updateCronDescription() {
    try {
      this.cronDescription = cronstrue.toString(this.form_data.cron);
    } catch(e) {
      this.cronDescription = 'Wrong schedule';
    }
  }

  submitForm(isValid) {
    if (!isValid) {
      return false;
    }

    this.is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = Object.assign({}, this.form_data);
    data.start_sending_at = `${this.moment(data.start_sending_at_date).format('DD-MM-YYYY')} ${data.start_sending_at_hour}`;
    delete data.start_sending_at_date;
    delete data.start_sending_at_hour;


    if (this.item.id) {
      this.EmailsDelivery.update(this.current_company_id, data, this.item.id)
        .then((data) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.emails_deliveries[this.emails_deliveries.findIndex(item => item.id === this.item.id)] = data;
          this.closeModal();
        }, () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
        });
    } else {
      this.EmailsDelivery.create(this.current_company_id, data)
        .then((data) => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
          this.emails_deliveries.push(data);
          this.closeModal();
        }, () => {
          this.is_submitting = false;
          this.$rootScope.show_spinner = false;
        });
    }

    return true;
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }

  onChangeSendEveryPeriod() {
    if (this.form_data.sending_type_periodically_period === 'Months') {
      this.sending_type_periodically_number_collection = this.months;
    } else if (this.form_data.sending_type_periodically_period === 'Weeks') {
      this.sending_type_periodically_number_collection = this.weeks;
    } else {
      this.sending_type_periodically_number_collection = this.days;
    }
    this.form_data.sending_type_periodically_number = this.sending_type_periodically_number_collection[0];
  }

  recipientConditionChange() {
    if (
      this.form_data.recipient_condition === 'all' ||
      this.form_data.recipient_condition === 'newsletter_subscribers'
      ) {
      this.form_data.start_sending_at_type = 'date';
      this.form_data.sending_type_periodically_number = this.sending_type_periodically_number_collection[0];
      this.form_data.sending_type_periodically_period = this.sending_type_periodically_period_collection[0];
    } else if (
      this.form_data.recipient_condition === 'birthday' ||
      [
        'reservation_label_wedding',
        'reservation_label_promotion',
        'reservation_label_party',
        'reservation_label_drinks',
        'reservation_label_condolence',
        'reservation_label_company_outing'
      ].includes(this.form_data.recipient_condition)
    ) {
      this.form_data.start_sending_at_type = 'date_from_details';
      this.form_data.sending_type_periodically_number = null;
      this.form_data.sending_type_periodically_period = null;
    }
  }
}
