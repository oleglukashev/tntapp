import { getName } from '../../../common/utils/name';

export default class Controller {
  constructor(Customer) {
    'ngInject';

    this.Customer = Customer;

    this.$onChanges = () => {
      this.current_company_id = this.currentCompanyId;
    };
  }

  search(query) {
    if (!query) return [];
    // Fixing known bug https://github.com/angular/material/issues/3279
    if (this.temp_query === query) return [];
    this.temp_query = query;

    return this.Customer.search(this.current_company_id, query).then((result) => {
      return result.map((customer) => {
        return {
          value: customer.id,
          first_name: customer.first_name,
          last_name: customer.last_name,
          city: customer.city,
          gender: customer.gender,
          house_number: customer.house_number,
          mail: customer.mail,
          primary_phone_number: customer.primary_phone_number,
          secondary_phone_number: customer.secondary_phone_number,
          zipcode: customer.zipcode,
          display: getName(customer.last_name, customer.first_name),
        };
      });
    });
  }

  selectedItemChange(item) {
    if (item) {
      this.reservation.mail = item.mail;
      this.reservation.primary_phone_number = item.primary_phone_number;
      this.reservation.secondary_phone_number = item.secondary_phone_number;
      this.reservation.first_name = item.first_name;
      this.reservation.last_name = item.last_name;
      this.reservation.city = item.city;
      this.reservation.gender = item.gender;
      this.reservation.house_number = item.house_number;
      this.reservation.zipcode = item.zipcode;
    }
  }
}
