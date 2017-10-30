import angular from 'angular';

export default angular.module('app.constants', [])
  .constant('AppConstants', {
    jwtKey: 'jwtToken',
    jwtRefresh: 'jwtRefresh',
    appName: 'TNT',
    late_minutes: 15,
    themes: ['Default', 'Aqua', 'Lego', 'Chocolate'],
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
    dayOfWeek: ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'],
    mailStatuses: {
      na_bezoek: 'Mail na bezoek',
      reservering_bevestigd: 'Bevestigingsmail',
      reservering_niet_mogelijk: 'Reservering niet mogelijk',
      reservering_ontvangen: 'Aanvraag',
    },
    productsClasses: {
      Lunch: 'mdi-silverware-variant',
      Brunch: 'mdi-martini',
      Ontbijt: 'mdi-food-fork-drink',
      Diner: 'mdi-beach',
      Borrel: 'mdi-food-fork-drink',
    },
    zonesClasses: {
      Bar: 'mdi-martini',
      Lounge: 'mdi-food',
      'Meeting room': 'mdi-google-circles-communities',
      Restaurant: 'mdi-silverware-variant',
      Terras: 'mdi-beach',
      Zaal: 'mdi-food-fork-drink',
    },
    emptyClass: 'mdi-close',
  })
  .constant('JQ_CONFIG', {
    easyPieChart: ['vendor/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'],
    plot: ['vendor/jquery/flot/jquery.flot.js'],
  })
  .constant('MODULE_CONFIG', [])
  .name;
