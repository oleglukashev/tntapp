import angular from 'angular';

export default angular.module('app.constants', [])
  .constant('AppConstants', {
    jwtKey: 'jwtToken',
    jwtRefresh: 'jwtRefresh',
    appName: 'TNT',
    late_minutes: 15,
    themes: ['Default', 'Aqua', 'Lego', 'Chocolate'],
    reservationStatuses: {
      cancelled: 'Geannuleerd',
      confirmed: 'Bevestigd',
      request: 'Aanvraag',
    },
    reservationDutchStatuses: {
      Geannuleerd: 'cancelled',
      Bevestigd: 'confirmed',
      Aanvraag: 'request',
    },
    reservationMenuStatuses: {
      reservation: [
        {
          disabled: true,
          name: 'Aanvraag',
          status: 'request',
          class: 'mdi-star-outline',
        },
        {
          disabled: true,
          name: 'Bevestig',
          status: 'confirmed',
          class: 'mdi-checkbox-blank-circle-outline',
        },
        {
          disabled: false,
          name: 'Annuleer',
          status: 'cancelled',
          class: 'mdi-close-circle',
        },
      ],

      confirmed: [
        {
          disabled: false,
          name: 'Aanvraag',
          status: 'request',
          class: 'mdi-star-outline',
        },
        {
          disabled: true,
          name: 'Bevestig',
          status: 'confirmed',
          class: 'mdi-checkbox-blank-circle-outline',
        },
        {
          disabled: false,
          name: 'Annuleer',
          status: 'cancelled',
          class: 'mdi-close-circle',
        },
      ],

      cancelled: [
        {
          disabled: false,
          name: 'Aanvraag',
          status: 'request',
          class: 'mdi-star-outline',
        },
        {
          disabled: false,
          name: 'Bevestig',
          status: 'confirmed',
          class: 'mdi-checkbox-blank-circle-outline',
        },
        {
          disabled: true,
          name: 'Annuleer',
          status: 'cancelled',
          class: 'mdi-close-circle',
        },
      ],

      request: [
        {
          disabled: true,
          name: 'Aanvraag',
          status: 'request',
          class: 'mdi-star-outline',
        },
        {
          disabled: false,
          name: 'Bevestig',
          status: 'confirmed',
          class: 'mdi-checkbox-blank-circle-outline',
        },
        {
          disabled: false,
          name: 'Annuleer',
          status: 'cancelled',
          class: 'mdi-close-circle',
        },
      ],
    },
    reservationPresentClasses: {
      expected: 'mdi-clock',
      present: 'mdi-check',
      delayed: 'mdi-exclamation',
    },
    reservationStatusClasses: {
      confirmed: 'mdi-checkbox-blank-circle-outline',
      cancelled: 'mdi-close',
      request: 'mdi-star-outline',
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
