export default class Controller {
  constructor($stateParams) {
    'ngInject';

    this.next_is_disabled = true;

    this.$onInit = () => {
      const page = parseInt($stateParams.page) || 1;
      this.next_is_disabled = true;

      this.checkNextPage({ page: page + 1, perPage: this.perPage }).then((entities) => {
        if (entities.length) {
          this.next_is_disabled = false;
        }
      });
    }
  }
}