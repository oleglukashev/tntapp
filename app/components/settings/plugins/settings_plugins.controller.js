export default class Controller {
  constructor(User, Settings, Untill, Notification, $rootScope, $interval, $state) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.Notification = Notification;
    this.Untill = Untill;
    this.$rootScope = $rootScope;
    this.$state = $state;
    this.$interval = $interval;
    this.is_loaded = false;
    this.iframe_widget = '<iframe src="https://dashboard.thenexttable.com/thenexttable-embed/iframe.php?rid=' + this.current_company_id + '" style="display: block; margin: 0 auto;" frameborder="0" seamless="seamless" height="440px;" width="300px;"></iframe>';

    this.loadGeneralSettings();
    this.loadPluginsSettings();
  }

  loadPluginsSettings() {
    this.Settings
      .getPluginsSettings(this.current_company_id).then(
        (pluginsSettings) => {
          this.api_token = pluginsSettings.api_token.token;
          this.wordpress_token = pluginsSettings.wordpress_token;
          this.tnr_sync_token = pluginsSettings.tnr_sync_token;
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

  loadGeneralSettings() {
    this.Settings
      .getGeneralSettings(this.current_company_id).then(
        (generalSettings) => {
          this.plugin_image_file_name = generalSettings.plugin_image_file_name;
          this.$rootScope.show_spinner = false;
        });
  }

  submitForm() {
    this.$rootScope.show_spinner = true;

    const data = {
      tnr_sync_token: this.tnr_sync_token,
    };

    this.Settings
      .updateTnrSyncTokenSettings(this.current_company_id, data).then(() => {
        this.$rootScope.show_spinner = false;
      },
      (error) => {
        this.errors = error.data;
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
    return this.untill_login && this.untill_password && this.untill_server;
  }
}
