export default class Controller {
  constructor() {
    'ngInject';

    this.$onChanges = () => {
      this.current_part = this.reservation.reservation_parts[this.currentIndex];
      this.translate_prefix = 'corona';

      if (this.type === 'customer') {
        this.translate_prefix += '_customer'
      }

      this.current_index = this.currentIndex;
      this.current_tab_index = this.currentTabIndex;
    };
  }
}
