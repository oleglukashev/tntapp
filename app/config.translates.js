import en from './l10n/en';
import nl from './l10n/nl';

export default function Config($translateProvider) {
  'ngInject';

  $translateProvider.translations('nl', nl);
  $translateProvider.translations('en', en);
  $translateProvider.preferredLanguage('nl');
  $translateProvider.useLocalStorage();
  $translateProvider.useSanitizeValueStrategy('sanitize');
}
