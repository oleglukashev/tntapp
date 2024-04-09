import angular from 'angular';
import countries from './config.countries.json';

export default angular.module('app.constants', [])
  .constant('AppConstants', {
    mollieAuthUrl: `https://www.mollie.com/oauth2/authorize?client_id=${MOLLIE_CLIENT_ID}&
                      redirect_uri=${MOLLIE_REDIRECT_URI}&state=TheNextSoftware&
                      scope=payments.read payments.write organizations.read profiles.read&
                      response_type=code&approval_prompt=auto`,
    twitterUrl: 'https://twitter.com',
    jwtKey: 'jwtToken',
    jwtRefresh: 'jwtRefresh',
    appName: 'TNT',
    late_minutes: 15,
    themes: ['Default', 'Aqua', 'Lego', 'Chocolate'],
    defaultThemeClass: 'default',
    reservationStatuses: [
      'confirmed',
      'request',
      'present',
      'delayed',
      'cancelled',
    ],
    leadReservationStatuses: [
      'confirmed',
      'lead',
      'cancelled',
    ],
    reservationDutchStatuses: {
      confirmed: 'Bevestigd',
      request: 'Aanvraag',
      present: 'Aanwezig',
      delayed: 'Niet aanwezig',
      cancelled: 'Geannuleerd',
      lead: 'Lead',
    },
    reservationEnglishStatuses: {
      'Bevestigd': 'confirmed',
      'Aanvraag': 'request',
      'Aanwezig': 'present',
      'Niet aanwezig': 'delayed',
      'Geannuleerd': 'cancelled',
    },
    leadTypes: {
      drinks: 'drinks',
      wedding: 'wedding',
      dinner: 'dinner',
      party: 'party',
      gala: 'gala',
      lunch: 'lunch',
      meeting: 'meeting',
      other: 'other',
    },
    reservationStatusClasses: {
      confirmed: 'mdi-checkbox-blank-circle-outline',
      cancelled: 'mdi-close',
      request: 'mdi-star-outline',
      expected: 'mdi-clock',
      present: 'mdi-check',
      paid: 'mdi-currency-usd',
      unpaid: 'mdi-currency-usd-off',
      lead: 'mdi-timer-sand',
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
