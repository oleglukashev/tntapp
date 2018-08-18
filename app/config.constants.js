import angular from 'angular';
import countries from './config.countries.json';

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
    chartColors: {
      orange: 'rgb(255,152,0)',
    },
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
    calendar: {
      format: 'dd-MM-yyyy',
      date_options: {
        formatYear: 'yy',
        startingDay: 1,
        showWeeks: false,
        maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    },
    countries,
    allergyClasses: {
      glutenfree: 'circle-gluten',
      lactose_free: 'circle-milk',
      tree_nuts_allergy: 'circle-nuts',
      peanut_allergy: 'circle-peanuts',
      egg_allergy: 'circle-eggs',
      shellfish_allergy: 'circle-fish',
      vegetarian: 'circle-vegetarian',
      vegan: 'circle-vegan',
      glutenvrij: 'circle-gluten',
      lactoseintolerant: 'circle-milk',
      notenallergie: 'circle-nuts',
      pinda_allergie: 'circle-peanuts',
      ei_allergie: 'circle-eggs',
      schaal_en_schelpdieren: 'circle-fish',
      vegetari_r: 'circle-vegetarian',
      veganist: 'circle-vegan',
    }
  })
  .constant('JQ_CONFIG', {
    easyPieChart: ['vendor/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'],
    plot: ['vendor/jquery/flot/jquery.flot.js'],
  })
  .constant('MODULE_CONFIG', [])
  .name;
