export default class Controller {
  constructor(User, Settings, AppConstants, Untill, Notification, $rootScope, $interval,
    $state, $stateParams, $q, $location) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.Notification = Notification;
    this.Untill = Untill;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$interval = $interval;
    this.is_loaded = false;
    this.AppConstants = AppConstants;
    this.iframe_widget = '<iframe src="https://dashboard.thenexttable.com/thenexttable-embed/iframe.php?rid=' + this.current_company_id + '" style="display: block; margin: 0 auto;" frameborder="0" seamless="seamless" height="440px;" width="300px;"></iframe>';

   
    $q.all([
      this.Settings.getGeneralSettings(this.current_company_id),
      this.Settings.getPluginsSettings(this.current_company_id)
    ]).then((result) => {
      this.plugin_image_file_name = result[0].plugin_image_file_name;
      this.api_token = result[1].api_token.token;
      this.wordpress_token = result[1].wordpress_token;
      this.tnr_sync_token = result[1].tnr_sync_token;
      this.accept_prepayment = result[1].accept_prepayment;
      this.prepayment_type = result[1].prepayment_type;
      this.prepayment_value = result[1].prepayment_value;
      this.mollie_access_token = result[1].mollie_access_token;
      this.mollie_refresh_token = result[1].mollie_refresh_token;
      this.mollie_profile_id = result[1].mollie_profile_id;

      if ($stateParams.access_token &&
        $stateParams.refresh_token &&
        ($stateParams.access_token !== this.mollie_access_token ||
         $stateParams.refresh_token !== this.mollie_refresh_token) &&
        $stateParams.action === 'update') {
        Settings.updatePluginSettings(this.current_company_id, {
          mollie_access_token: $stateParams.access_token,
          mollie_refresh_token: $stateParams.refresh_token,
          prepayment_value: 1
        }).then((pluginsSettings) => {
          this.mollie_access_token = pluginsSettings.mollie_access_token;
          this.mollie_refresh_token = pluginsSettings.mollie_refresh_token;
          this.prepayment_value = 1;
          $location.search('access_token', null);
          $location.search('refresh_token', null);
          $location.search('action', null);
        });
      }

      this.$rootScope.show_spinner = false;
      this.loadUntillSettings();
    });
  }

  loadUntillSettings() {
    this.Untill
      .getSettings(this.current_company_id).then(
        (settings) => {
          this.is_loaded = true;
          this.untill_login = settings.untill_login;
          this.untill_password = settings.untill_password;
          this.untill_server = settings.untill_server;
        });
  }

  submitForm() {
    this.$rootScope.show_spinner = true;

    const data = {
      accept_prepayment: this.accept_prepayment,
      prepayment_type: this.prepayment_type,
      prepayment_value: this.prepayment_value,
      tnr_sync_token: this.tnr_sync_token,
      mollie_profile_id: this.mollie_profile_id
    };

    this.Settings
      .updatePluginSettings(this.current_company_id, data).then(() => {
        this.$rootScope.show_spinner = false;
      },
      (error) => {
        this.errors = error.data;
        this.$rootScope.show_spinner = false;
      });
  }

  uploadImage(file, errFiles) {
    if (file) {
      this.image_is_submiting = true;
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = (fileLoadedEvent) => {
        // start number of fix progress bar
        this.percent_upload_file = 0;
        const progressInterval = this.$interval(() => {
          this.percent_upload_file += 5;
          if (this.percent_upload_file >= 90) {
            this.$interval.cancel(progressInterval);
          }
        }, 50);

        let srcData = fileLoadedEvent.target.result;
        srcData = srcData.replace(/data:image\/(png|jpeg);base64,/g, '');

        const data = {
          plugin_image_file_name: srcData,
        };

        this.Settings
          .updateGeneralSettings(this.current_company_id, data).then((result) => {
            this.plugin_image_file_name = result.data.plugin_image_file_name;
            this.$interval.cancel(progressInterval);
            this.percent_upload_file = null;
            this.image_is_submiting = false;
          }, (error) => {
            if (error.status > 0) this.upload_image_error = error.status;
            this.image_is_submiting = false;
          });
      };
    }

    if (errFiles && errFiles[0]) {
      this.Notification.setText(`${errFiles[0].$error} ${errFiles[0].$errorParam}`);
    }
  }

  removeImage() {
    this.$rootScope.show_spinner = true;

    const data = {
      plugin_image_file_name: null,
    };

    this.Settings
      .updateGeneralSettings(this.current_company_id, data).then((result) => {
        this.plugin_image_file_name = result.data.plugin_image_file_name;
        this.$rootScope.show_spinner = false;
      });
  }

  canShowImage() {
    return this.plugin_image_file_name && !this.image_is_submiting;
  }

  canShowUntillLinked() {
    return this.untill_login && this.untill_server;
  }

  connectToMollie() {
    window.location.href = this.AppConstants.mollieAuthUrl;
  }

  removeConnectionToMollie() {
    this.Settings.updatePluginSettings(this.current_company_id, {
      mollie_access_token: null,
      mollie_refresh_token: null
    }).then((pluginsSettings) => {
      this.mollie_access_token = null;
      this.mollie_refresh_token = null;
      this.mollie_profile_id = null;
    });
  }
}
