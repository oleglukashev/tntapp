import appLayout from './components/layout/app.html';
import loginLayout from './components/layout/login.html';
import reservationLayout from './components/layout/reservation.html';

export default function routes($stateProvider, $urlRouterProvider, $locationProvider) {
  'ngInject';

  $stateProvider
    .state('app', {
      abstract: true,
      template: appLayout,
      resolve: {
        auth: (User) => {
          User.ensureAuthForClosedPages();
        },
      },
    })

    // DASHBOARD
    .state('app.dashboard', {
      url: '/?status&iban&sender_email_token',
      component: 'dashboardComponent',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "dashboard.module" */ "./components/dashboard")
          .then(mod => $ocLazyLoad.load({ name: 'dashboard' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })

    // ANALYTICS
    .state('app.analytics', {
      url: '/analytics',
      component: 'analytics',
      params: {
        productId: null,
      },
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "analytics.module" */ "./components/analytics")
          .then(mod => $ocLazyLoad.load({ name: 'analytics' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // CUSTOMERS
    .state('app.customers', {
      url: '/customers',
      component: 'customers',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "customers.module" */ "./components/customers")
          .then(mod => $ocLazyLoad.load({ name: 'customers' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })

    // SEARCH
    .state('app.search', {
      url: '/search',
      component: 'search',
      params: {
        reservations: null,
      },
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "search.module" */ "./components/search")
          .then(mod => $ocLazyLoad.load({ name: 'search' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })

    // AGENDA
    .state('app.agenda', {
      url: '/agenda',
      component: 'agenda',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "agenda.module" */ "./components/agenda")
          .then(mod => $ocLazyLoad.load({ name: 'agenda' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })



    // AUTH
    .state('auth', {
      template: loginLayout,
      resolve: {
        auth: (User) => {
          User.ensureAuthForLoginPages()
        },
      },
    })

    // LOGIN
    .state('auth.login', {
      url: '/login',
      component: 'login',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "auth.module" */ "./components/auth")
          .then(mod => $ocLazyLoad.load({ name: 'auth' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })

    // REGISTER
    .state('auth.register', {
      url: '/register',
      component: 'login',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "auth.module" */ "./components/auth")
          .then(mod => $ocLazyLoad.load({ name: 'auth' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })

    // RESET PASSWORD
    .state('auth.reset_password', {
      url: '/reset_password',
      component: 'resetPassword',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "auth.module" */ "./components/auth")
          .then(mod => $ocLazyLoad.load({ name: 'auth' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })

    // RESET PASSWORD FINISH
    .state('auth.reset_password_finish', {
      url: '/reset_password/:id/:token',
      component: 'resetPassword',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "auth.module" */ "./components/auth")
          .then(mod => $ocLazyLoad.load({ name: 'auth' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })

    // ACTIVATION
    .state('auth.activate', {
      url: '/activate/:id/:token',
      component: 'activation',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "auth.module" */ "./components/auth")
          .then(mod => $ocLazyLoad.load({ name: 'auth' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // AUTH VIA ADMIN
    .state('auth_admin', {
      template: loginLayout,
    })

    .state('auth_admin.login_via_admin', {
      url: '/login_via_admin/:token',
      component: 'loginViaAdmin',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "auth.module" */ "./components/auth")
          .then(mod => $ocLazyLoad.load({ name: 'auth' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // GENERAL SETTINGS
    .state('app.general_settings', {
      url: '/settings/general',
      component: 'generalSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "general.settings.module" */ "./components/settings/general")
          .then(mod => $ocLazyLoad.load({ name: 'generalSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // CUSTOMER SETTINGS NAMES SETTINGS
    .state('app.customer_names_settings', {
      url: '/settings/settings_names',
      component: 'customerNamesSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "customer_names.settings.module" */ "./components/settings/customer_settings_names")
          .then(mod => $ocLazyLoad.load({ name: 'customerNamesSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // EMAILS SETTINGS
    .state('app.emails_settings', {
      url: '/settings/emails',
      component: 'emailsSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "emails.settings.module" */ "./components/settings/emails")
          .then(mod => $ocLazyLoad.load({ name: 'emailsSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // PRODUCTS SETTINGS
    .state('app.products_settings', {
      url: '/settings/products',
      component: 'productsSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "products.settings.module" */ "./components/settings/products")
          .then(mod => $ocLazyLoad.load({ name: 'productsSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // LIMITS SETTINGS
    .state('app.limits_settings', {
      url: '/settings/limits',
      component: 'limitsSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "limits.settings.module" */ "./components/settings/limits")
          .then(mod => $ocLazyLoad.load({ name: 'limitsSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // EMPLOYEES SETTINGS
    .state('app.employees_settings', {
      url: '/settings/employees',
      component: 'employeesSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "employees.settings.module" */ "./components/settings/employees")
          .then(mod => $ocLazyLoad.load({ name: 'employeesSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // TABLES SETTINGS
    .state('app.tables_settings', {
      url: '/settings/tables',
      component: 'tablesSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "tables.settings.module" */ "./components/settings/tables")
          .then(mod => $ocLazyLoad.load({ name: 'tablesSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // PLUGINS SETTINGS
    .state('app.plugins_settings', {
      url: '/settings/plugins?access_token&refresh_token&action',
      component: 'pluginsSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "plugins.settings.module" */ "./components/settings/plugins")
          .then(mod => $ocLazyLoad.load({ name: 'pluginsSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // WARNINGS SETTINGS
    .state('app.warnings_settings', {
      url: '/settings/warnings',
      component: 'warningsSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "warnings.settings.module" */ "./components/settings/warnings")
          .then(mod => $ocLazyLoad.load({ name: 'warningsSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })

    // THEMES SETTINGS
    .state('app.themes_settings', {
      url: '/settings/themes',
      component: 'themesSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "themes.settings.module" */ "./components/settings/themes")
          .then(mod => $ocLazyLoad.load({ name: 'themesSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // LIGHTSPEED SETTINGS
    .state('app.lightspeed_settings', {
      url: '/settings/lightspeed',
      component: 'lightspeedSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "lightspeed.settings.module" */ "./components/settings/lightspeed")
          .then(mod => $ocLazyLoad.load({ name: 'lightspeedSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // UNTILL CREDINTAILS SETTINGS
    .state('app.untill_credintails_settings', {
      url: '/settings/untill_credintails',
      component: 'pluginsUntillSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "plugins_untill.settings.module" */ "./components/settings/plugins_untill")
          .then(mod => $ocLazyLoad.load({ name: 'pluginsUntillSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // UNTILL SETTINGS
    .state('app.untill_settings', {
      url: '/settings/untill?page',
      component: 'untillSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "untill.settings.module" */ "./components/settings/untill")
          .then(mod => $ocLazyLoad.load({ name: 'untillSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })

    // TNI SETTINGS
    .state('app.tni_settings', {
      url: '/settings/tni',
      component: 'tniSettings',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "tni.settings.module" */ "./components/settings/tni")
          .then(mod => $ocLazyLoad.load({ name: 'tniSettings' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })


    // CUSTOMER RESERVATIONS
    .state('customer_reservation', {
      template: reservationLayout,
    })
    .state('customer_reservation.new', {
      url: '/reservation/:id?date&aantal_personen&start_date',
      component: 'newCustomerReservation',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "new.customer.reservation.module" */ "./components/new.customer.reservation")
          .then(mod => $ocLazyLoad.load({ name: 'newCustomerReservation' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })
    .state('customer_reservation.finish', {
      url: '/company/:company_id/reservation/:id/finish?secure_token',
      component: 'finishCustomerReservation',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "finish.customer.reservation.module" */ "./components/finish.customer.reservation")
          .then(mod => $ocLazyLoad.load({ name: 'finishCustomerReservation' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })
    .state('customer_reservation.alternative', {
      url: '/thenexttable-embed/iframe.php?rid&date&aantal_personen&start_date',
      component: 'newCustomerReservation',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "new.customer.reservation.module" */ "./components/new.customer.reservation")
          .then(mod => $ocLazyLoad.load({ name: 'newCustomerReservation' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })
    .state('customer_reservation.alternative_start', {
      url: '/index.php/reservering/:id/start?date&aantal_personen&start_date',
      component: 'newCustomerReservation',
      lazyLoad: ($transition$) => {
        const $ocLazyLoad = $transition$.injector().get("$ocLazyLoad");

        return import(/* webpackChunkName: "new.customer.reservation.module" */ "./components/new.customer.reservation")
          .then(mod => $ocLazyLoad.load({ name: 'newCustomerReservation' }))
          .catch(err => {
            throw new Error("Ooops, something went wrong, " + err);
          });
      }
    })
    ;

  $urlRouterProvider.otherwise('/');

  if (`${ENV}` !== 'dev') {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false,
    });
  }
}
