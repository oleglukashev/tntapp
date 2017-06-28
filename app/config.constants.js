import angular from 'angular';

export default angular.module('app.constants', [])
  .constant('AppConstants', {
    jwtKey: 'jwtToken',
    jwtRefresh: 'jwtRefresh',
    appName: 'TNT',
    reservationDutchStatuses: {
      'Geannuleerd': 'cancelled',
      'Bevestigd'  : 'confirmed',
      'Aanvraag'   : 'request',
      'Reservering': 'present'
    },
    reservationMenuStatuses: {
      present: [
        {
          disabled: true,
          name    : 'Aanvraag',
          status  : 'request',
          class   : 'mdi-star-outline'
        },
        {
          disabled: true,
          name    : 'Bevestig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-blank-circle-outline'
        },
        {
          disabled: false,
          name    : 'Is NIET aanwezig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-marked-circle'
        },
        {
          disabled: false,
          name    : 'Annuleer',
          status  : 'cancelled',
          class   : 'mdi-close-circle'
        },
      ],

      confirmed: [
        {
          disabled: false,
          name    : 'Aanvraag',
          status  : 'request',
          class   : 'mdi-star-outline'
        },
        {
          disabled: true,
          name    : 'Bevestig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-blank-circle-outline'
        },
        {
          disabled: false,
          name    : 'Is aanwezig',
          status  : 'present',
          class   : 'mdi-checkbox-marked-circle'
        },
        {
          disabled: false,
          name    : 'Annuleer',
          status  : 'cancelled',
          class   : 'mdi-close-circle'
        },
      ],

      cancelled: [
        {
          disabled: false,
          name    : 'Aanvraag',
          status  : 'request',
          class   : 'mdi-star-outline'
        },
        {
          disabled: false,
          name    : 'Bevestig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-blank-circle-outline'
        },
        {
          disabled: true,
          name    : 'Is aanwezig',
          status  : 'present',
          class   : 'mdi-checkbox-marked-circle'
        },
        {
          disabled: true,
          name    : 'Annuleer',
          status  : 'cancelled',
          class   : 'mdi-close-circle'
        },
      ],

      request: [
        {
          disabled: true,
          name    : 'Aanvraag',
          status  : 'request',
          class   : 'mdi-star-outline'
        },
        {
          disabled: false,
          name    : 'Bevestig',
          status  : 'confirmed',
          class   : 'mdi-checkbox-blank-circle-outline'
        },
        {
          disabled: true,
          name    : 'Is aanwezig',
          status  : 'present',
          class   : 'mdi-checkbox-marked-circle'
        },
        {
          disabled: false,
          name    : 'Annuleer',
          status  : 'cancelled',
          class   : 'mdi-close-circle'
        },
      ],
    },
    reservationStatusClasses: {
      expected : 'mdi-clock',
      present  : 'mdi-check',
      delayed  : 'mdi-exclamation',
      confirmed: 'mdi-checkbox-blank-circle-outline',
      cancelled: 'mdi-close',
      request  : 'mdi-star-outline'
    },
  })
  .constant('JQ_CONFIG', {
    easyPieChart: ['vendor/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'],
    plot: ['vendor/jquery/flot/jquery.flot.js']
  })
  .constant('MODULE_CONFIG', [])
  .name;
