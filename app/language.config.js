language_config.$inject = ['$urlRouterProvider'];

export default function language_config($translateProvider) {
  // Register a loader for the static files
  // So, the module will search missing translation tables under the specified urls.
  // Those urls are [prefix][langKey][suffix].
  $translateProvider.useStaticFilesLoader({
    prefix: 'app/l10n/',
    suffix: '.js'
  });
  // Tell the module what language to use by default
  $translateProvider.preferredLanguage('en');
  // Tell the module to store the language in the local storage
  $translateProvider.useLocalStorage();
}