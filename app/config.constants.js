import angular from 'angular';

export default angular.module('app.constants', [])
  .constant('AppConstants', {
    twitterUrl: 'https://twitter.com',
    jwtKey: 'jwtToken',
    jwtRefresh: 'jwtRefresh',
    appName: 'TNT',
    late_minutes: 15,
    themes: ['Default', 'Aqua', 'Lego', 'Chocolate'],
    defaultThemeClass: 'default-theme',
    reservationStatuses: [
      'confirmed',
      'request',
      'present',
      'delayed',
      'cancelled',
    ],
    reservationDutchStatuses: {
      confirmed: 'Bevestigd',
      request: 'Aanvraag',
      present: 'Aanwezig',
      delayed: 'Niet aanwezig',
      cancelled: 'Geannuleerd',
    },
    reservationEnglishStatuses: {
      'Bevestigd': 'confirmed',
      'Aanvraag': 'request',
      'Aanwezig': 'present',
      'Niet aanwezig': 'delayed',
      'Geannuleerd': 'cancelled',
    },
    reservationStatusClasses: {
      confirmed: 'mdi-checkbox-blank-circle-outline',
      cancelled: 'mdi-close',
      request: 'mdi-star-outline',
      expected: 'mdi-clock',
      present: 'mdi-check',
      delayed: 'mdi-exclamation',
    },
    letterOfWeek: ['Z', 'M', 'D', 'W', 'D', 'V', 'Z'],
    dayOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    productsClasses: {
      lunch: 'mdi-silverware-variant',
      brunch: 'mdi-martini',
      breakfast: 'mdi-food-fork-drink',
      diner: 'mdi-beach',
      drink: 'mdi-food-fork-drink',
    },
    zonesClasses: {
      bar: 'mdi-martini',
      lounge: 'mdi-food',
      meeting_room: 'mdi-google-circles-communities',
      restaurant: 'mdi-silverware-variant',
      terrace: 'mdi-beach',
      hall: 'mdi-food-fork-drink',
    },
    emptyClass: 'mdi-close',
  })
  .constant('JQ_CONFIG', {
    easyPieChart: ['vendor/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'],
    plot: ['vendor/jquery/flot/jquery.flot.js'],
  })
  .constant('MODULE_CONFIG', [])
  .name;
