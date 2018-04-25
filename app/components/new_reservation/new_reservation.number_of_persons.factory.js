export default function NewReservationNumberOfPersonsFactory(Reservation) {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.choose_number_of_persons_is_opened = false;

    instance.numberOfPersonsMoreThanTableSeats = () =>
      instance.current_part.number_of_persons >
        Reservation.generalNumberOfPersons(instance.tables, instance.current_part.tables);

    instance.changeNumberOfPersonsInputPostProcess = () => {
      instance.current_part.product = null;
      instance.current_part.current_product = null;
      instance.clearAndLoadTime();
    };

    instance.changeNumberOfPersonsPostProcess = () => {
      instance.changeNumberOfPersonsInputPostProcess();

      if (instance.current_part.number_of_persons) {
        instance.selectTab(instance.pagination.number_of_persons);
      }
    };

    instance.changeIsGroupPostProcess = () => {
      instance.reservation.reservation_parts = [instance.current_part];
    };

    instance.triggerChooseNumberOfPersons = () => {
      instance.choose_number_of_persons_is_opened = !instance.choose_number_of_persons_is_opened;
    };
  };
}
