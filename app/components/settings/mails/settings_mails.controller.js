import angular from 'angular';

export default class SettingsMailsCtrl {
  constructor(User, Settings, filterFilter, $scope, $modal) {
    'ngInject';

    this.current_company = User.current_company;

    this.$scope 	    = $scope;
    this.$modal       = $modal;
    this.filterFilter = filterFilter;
    this.Settings     = Settings;
    this.is_loaded    = false;
    this.statuses     = {
      'na_bezoek'                 :'Mail ne bezoek',
      'reservering_bevestigd'     :'Bevestigingsmail',
      'reservering_niet_mogelijk' :'Reservering niet mogelijk',
      'reservering_ontvangen'     :'Aanvraag'
    }

    this.loadMailsSettings();
    this.loadMailsTextsSettings();
  }

  loadMailsSettings() {
    this.Settings
      .getMailsSettings(this.current_company.id)
        .then(
          (mails_settings) => {
            this.mails_settings_is_loaded = true;
            this.mails_settings_form_data = mails_settings;
            this.setIsLoaded();
          });
  }

  loadMailsTextsSettings() {
    this.Settings
      .getMailsTextsSettings(this.current_company.id)
        .then(
          (mails_settings) => {
            this.mails_texts_settings_is_loaded = true;
            this.mails_texts_settings           = mails_settings;
            this.setIsLoaded();
          });
  }

	submitMailsSettingsForm() {
		this.Settings
			.updateMailsSettings(this.current_company.id, this.mails_settings_form_data)
	      .then((general_settings) => {
	      });
	}

  editMail(id) {
    let that = this;
    let modalInstance = this.$modal.open({
      templateUrl: 'settings_mails.edit_mail.view.html',
      controller: 'SettingsMailsEditMailCtrl as edit_mail',
      size: 'md',
      resolve: {
          item: function () {
            return that.filterFilter(that.mails_texts_settings, { id: id })[0];
          }
        }
    });

    modalInstance.result.then((selectedItem) => {
      //success
    }, () => {
      // fail
    });
  }

  setIsLoaded() {
    this.is_loaded = this.mails_settings_is_loaded && this.mails_texts_settings_is_loaded;
  }
}