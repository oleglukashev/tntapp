export default class AppCtrl {
  constructor($scope, $translate, $window) {
    // add 'ie' classes to html
    const isIE = !!navigator.userAgent.match(/MSIE/i);
    if (isIE) {
      angular.element($window.document.body).addClass('ie');
    }
    if (this.isSmartDevice($window)) {
      angular.element($window.document.body).addClass('smart')
    }
    ;

    // angular translate
    $scope.lang = {isopen: false};
    $scope.langs = {en: 'English', de_DE: 'German', it_IT: 'Italian'};
    $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
    $scope.setLang = function (langKey, $event) {
      // set the current lang
      $scope.selectLang = $scope.langs[langKey];
      // You can change the language during runtime
      $translate.use(langKey);
      $scope.lang.isopen = !$scope.lang.isopen;
    };
  }

  isSmartDevice($window) {
    // Adapted from http://www.detectmobilebrowsers.com
    const ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
    // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
    return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
  }
}


AppCtrl.$inject = ['$scope', '$translate', '$window'];