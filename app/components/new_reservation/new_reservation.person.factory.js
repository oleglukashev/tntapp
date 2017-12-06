export default function NewReservationPersonFactory() {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.additional_is_opened = false;

    instance.openDatepicker = () => {
      instance.opened = true;
    };

    instance.triggerAdditionalInfo = () => {
      instance.additional_is_opened = !instance.additional_is_opened;
    };
  };
}
