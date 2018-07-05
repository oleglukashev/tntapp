import { buildURL } from '../../common/utils';

function PhoneValid($http, $rootScope) {
  'ngInject';

  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ngModel) {
      let submitIsDisabled = false;

      element.after("<i class='phone-is-ok mdi mdi-check'></i>");

      const okIcon = element.next('.phone-is-ok');
      okIcon.hide();

      element.bind('keydown', function(event) {
        if (event.keyCode !== 13) {
          submitIsDisabled = true;
          okIcon.hide();
        }
      });

      element.bind('keypress', function(event) {
        if (event.keyCode === 13 && submitIsDisabled) {
          return false;
        }
      });

      element.bind('change', function() {
        initValidation();
      });

      function initValidation() {
        const phone = element.val();

        if (phone.length) {
          $rootScope.show_spinner = true;

          return $http({
            url: buildURL(`${API_URL}/phone_valid`, { phone }),
            skipAuthorization: true,
            method: 'GET',
          }).then((result) => {
            ngModel.$setValidity('phoneValid', result.data);
            $rootScope.show_spinner = false;
            submitIsDisabled = false;

            if (result.data) {
              okIcon.show();
            }
          }, () => {
            submitIsDisabled = false;
          });
        } else {
          ngModel.$setValidity('phoneValid', true);
          submitIsDisabled = false;
          okIcon.hide();
        }
      }
    }
  };
}

export default PhoneValid;
