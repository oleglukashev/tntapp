const loginData = require('./protractor-login.js');

exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to the configuration file location passed
  specs: ['specs/*.js'],

  multiCapabilities: [
    // Possible to use couple of browsers
    // {
    //   browserName: 'firefox',
    // },
    {
      browserName: 'chrome',
      // Here we can save cookies to don't login every time
      // chromeOptions: {
      //   args: ['--user-data-dir=~/chromeSettings'],
      // },
    },
  ],

  jasmineNodeOpts: {
    showColors: true, // Use colors in the command line report.
  },

  onPrepare: () => {
    browser.driver.get('http://tnt.me:8082');

    element(by.model('auth.formData._username')).sendKeys(loginData.login);
    element(by.model('auth.formData._password')).sendKeys(loginData.password);
    element(by.css('[type="submit"]')).click();

    // Login takes some time, so wait until it's done.
    return browser.driver.wait(() => element(by.css('[ng-click="dash.openReservation()"]')).isPresent(), 10000);
  },
};
