export default class SettingsPluginsCtrl {
  constructor(User, Settings, Notification, $rootScope, $interval) {
    'ngInject';

    this.current_company_id = User.getCompanyId();
    this.Settings = Settings;
    this.Notification = Notification;
    this.$rootScope = $rootScope;
    this.$interval = $interval;
    this.is_loaded = false;
    this.iframe_widget = '<iframe src="https://dashboard.thenexttable.com/thenexttable-embed/iframe.php?rid=' + this.current_company_id + '" style="display: block; margin: 0 auto;" frameborder="0" seamless="seamless" height="440px;" width="300px;"></iframe>'

    this.loadGeneralSettings();
    this.loadPluginsSettings();
    this.$rootScope.show_spinner = true;
  }

  loadPluginsSettings() {
    this.Settings
      .getPluginsSettings(this.current_company_id).then(
        (pluginsSettings) => {
          this.$rootScope.show_spinner = false;
          this.is_loaded = true;
          this.api_token = pluginsSettings.api_token.token;
          this.wordpress_token = pluginsSettings.wordpress_token;
          this.tnr_sync_token = pluginsSettings.tnr_sync_token;
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
      this.$rootScope.show_spinner = true;
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
            this.$rootScope.show_spinner = false;
            this.$interval.cancel(progressInterval);
            this.percent_upload_file = null;
          }, (error) => {
            if (error.status > 0) this.upload_image_error = error.status;
          });
      };
    }

    if (errFiles && errFiles[0]) {
      this.Notification.setText(`${errFiles[0].$error} ${errFiles[0].$errorParam}`);
    }
  }

  removeImage() {
    const data = {
      plugin_image_file_name: null,
    };

    this.Settings
      .updateGeneralSettings(this.current_company_id, data).then((result) => {
        this.plugin_image_file_name = result.data.plugin_image_file_name;
        this.$rootScope.show_spinner = false;
      });
  }
}
