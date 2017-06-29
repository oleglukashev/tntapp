export default class SettingsMailsEditMailCtrl {
  constructor(User, item, Settings, $modalInstance) {
    'ngInject';

    this.current_company = User.current_company;
    this.Settings       = Settings;
    this.$modalInstance = $modalInstance

    this.form_data      = item;
    this.types          = {
      'na_bezoek'                 :'Mail ne bezoek',
      'reservering_bevestigd'     :'Bevestigingsmail',
      'reservering_niet_mogelijk' :'Reservering niet mogelijk',
      'reservering_ontvangen'     :'Aanvraag'
    }
  }

  submitForm(is_valid) {
    if (!is_valid) {
      return false;
    }

    this.is_submitting = true;
    
    let data = {
      title: this.form_data.title,
      content: this.form_data.content
    }

    this.Settings
      .updateMailtext(this.current_company.id, this.form_data.id, data)
        .then((mail) => {
          this.is_submitting = false;
          this.$modalInstance.dismiss('cancel');
        }, (error) => {
          // nothing
        });
  }

  closeModal() {
    this.$modalInstance.dismiss('cancel');
  }
}