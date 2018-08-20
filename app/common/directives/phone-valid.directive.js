import { buildURL } from '../../common/utils';

function PhoneValid($http, $rootScope) {
  'ngInject';

  return {
    restrict: 'A',
    require: 'ngModel',
    link: (scope, element, attrs, ngModel) => {
      let submitIsDisabled = false;
      element.after("<i class='phone-is-ok mdi mdi-check'></i>");

      const okIcon = element.next('.phone-is-ok');
      okIcon.hide();

      function initValidation() {
        const phone = element.val();
        okIcon.hide();

        if (phone.length) {
          $rootScope.show_spinner = true;

          return $http({
            url: buildURL(`${API_URL}/phone_valid`, { phone, country: scope.country }),
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
        }

        ngModel.$setValidity('phoneValid', true);
        submitIsDisabled = false;

        return null;
      }

      attrs.$observe('country', () => {
        initValidation();
      });

      element.bind('keydown', (event) => {
        if (event.keyCode !== 13) {
          submitIsDisabled = true;
          okIcon.hide();
        }
      });

      element.bind('keypress', (event) => {
        if (event.keyCode === 13 && submitIsDisabled) {
          return false;
        }
      });

      element.bind('change', () => {
        initValidation();
      });
    },
  };
}

export default PhoneValid;
