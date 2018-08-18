export default class EditUserMenuNotesCtrl {
  constructor(User, CustomerNote, UserMenu, $rootScope) {
    'ngInject';

    this.currentCompanyId = User.getCompanyId();
    this.CustomerNote = CustomerNote;
    this.UserMenu = UserMenu;
    this.$rootScope = $rootScope;

    this.$onInit = () => {
    }
  }

  delete(index) {
    this.$rootScope.show_spinner = true;

    this.CustomerNote.delete(this.currentCompanyId, this.customer.id, this.customerNotes[index].id).then(() => {
      this.$rootScope.show_spinner = false;
      this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
      this.customerNotes.splice(index, 1);
      this.UserMenu.notes = this.customerNotes;
      this.item = null;
    }, () => {
      this.$rootScope.show_spinner = false;
    });
  }

  submitForm(form) {
    if (!form.$valid) {
      return false;
    }

    this.notes_is_submitting = true;
    this.$rootScope.show_spinner = true;

    const data = {
      note: this.item.note,
    };

    if (this.item.id) {
      this.CustomerNote.update(this.currentCompanyId, this.customer.id, this.item.id, data).then((result) => {
        this.item = null;
        this.UserMenu.notes = this.customerNotes;
        this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
        this.notes_is_submitting = false;
        this.$rootScope.show_spinner = false;
        form.$setPristine();
        form.$setUntouched();
        this.dismiss({$value: 'cancel'});
      }, () => {
        this.$rootScope.show_spinner = false;
      });
    } else {
      this.CustomerNote.create(this.currentCompanyId, this.customer.id, data).then((result) => {
        this.item = null;
        this.customerNotes.push(result);
        this.UserMenu.notes = this.customerNotes;
        this.$rootScope.$broadcast('NewReservationCtrl.reload_reservations');
        this.notes_is_submitting = false;
        this.$rootScope.show_spinner = false;
        form.$setPristine();
        form.$setUntouched();
        this.dismiss({$value: 'cancel'});
      }, () => {
        this.$rootScope.show_spinner = false;
      });
    }
  }
}
