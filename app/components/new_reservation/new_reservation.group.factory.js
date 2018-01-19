export default function NewReservationGroupFactory() {
  'ngInject';

  return (that) => {
    const instance = that;

    instance.addPart = () => {
      const newPart = instance.ReservationPart.getNewReservationPart();
      newPart.date = new Date();
      instance.reservation.reservation_parts.push(newPart);
    };

    instance.removePart = (e, index) => {
      e.stopPropagation();
      if (instance.reservation.reservation_parts.length > 1) {
        instance.reservation.reservation_parts.splice(index, 1);
        instance.current_part = instance.reservation.reservation_parts[0];
      }
    };
  };
}
