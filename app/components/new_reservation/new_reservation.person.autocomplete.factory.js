export default function NewReservationPersonAutocompleteFactory(Customer, $timeout) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.search = (query) => {
      if (!query) return [];
      // Fixing known bug https://github.com/angular/material/issues/3279
      if (instance.temp_query === query) return [];
      instance.temp_query = query;

      return Customer.search(instance.current_company_id, query).then((result) => {
        return result.map((customer) => {
          return {
            value: customer.id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            mail: customer.mail,
            primary_phone_number: customer.primary_phone_number,
            display: `${customer.first_name} ${customer.last_name}`,
          };
        });
      });
    };

    instance.selectedItemChange = (item) => {
      if (item) {
        instance.reservation.mail = item.mail;
        instance.reservation.primary_phone_number = item.primary_phone_number;
        instance.reservation.first_name = item.first_name;
        instance.reservation.last_name = item.last_name;

        instance.walk_in.mail = item.mail;
        instance.walk_in.primary_phone_number = item.primary_phone_number;
        instance.walk_in.first_name = item.first_name;
        instance.walk_in.last_name = item.last_name;

        // trying to solve [object Object] bug: https://github.com/angular/material/issues/3760
        $timeout(() => {
          if (!item.last_name) {
            instance.reservation.last_name = ' ';
            instance.walk_in.last_name = ' ';
            item.last_name = ' ';
          }
        }, 100);
      }
    };
  };
}
