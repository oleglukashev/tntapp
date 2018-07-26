import en from './l10n/en';
import nl from './l10n/nl';

export default function Config($translateProvider, $mdDateLocaleProvider, moment) {
  'ngInject';
  const defaultLang = 'nl';

  $translateProvider.translations('nl', nl);
  $translateProvider.translations('en', en);
  $translateProvider.preferredLanguage(defaultLang);
  $translateProvider.useLocalStorage();
  $translateProvider.useSanitizeValueStrategy('sanitize');

  let lang = window.localStorage.NG_TRANSLATE_LANG_KEY

  if (!lang) {
    lang = defaultLang
  }

  $mdDateLocaleProvider.firstDayOfWeek = 1;
  $mdDateLocaleProvider.formatDate = (date) => {
    const dateFormat = lang === 'nl' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
    return moment(date).format(dateFormat);
  }
}
