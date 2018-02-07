const reservationData = {
  firstName: 'tester',
  lastName: 'tester',
  email: 'tester@test.com',
  phone: '1111111',
};

describe('TNT app', () => {
  it('create full reservation', () => {
    const addReservationButton = element(by.css('[ng-click="dash.openReservation()"]'));
    addReservationButton.click();

    const fullReservationButton = element.all(by.css('label.box')).get(0);
    fullReservationButton.click();

    const currentData = element(by.css('div.datepicker button.active'));
    currentData.click();

    const numberOfPersons = element.all(by.repeater('number in [1,2,3,4,5,6,7,8,9,10]'));
    numberOfPersons.first().click();

    const products = element.all(by.repeater('product in reserv.products'));
    products.first().click();

    const timePeriods = element.all(by.repeater('time_obj in reserv.openedTimeRangePeriod()'));
    timePeriods.first().click();

    const zones = element.all(by.repeater('zone in reserv.zones'));
    zones.first().click();

    const tables = element.all(by.repeater('table_id in reserv.current_part.zone.table_ids'));
    tables.first().click();

    const confirmButton = element.all(by.css('button.w-full'));
    confirmButton.first().click();

    const searchElements = element.all(by.css('[type=search]'));
    searchElements.get(1).sendKeys(reservationData.firstName);
    searchElements.get(2).sendKeys(reservationData.lastName);
    element(by.model('reserv.reservation.mail')).sendKeys(reservationData.email);
    element(by.model('reserv.reservation.primary_phone_number')).sendKeys(reservationData.phone);

    const submitButton = element.all(by.css('[type=submit]'));
    submitButton.first().click();

    const closeModalButton = element(by.css('[ng-click="dash_reserv.closeModalOrConfirm(reserv.success);"]'));
    closeModalButton.click();

    const lastReservations = element.all(by.repeater('item in today_data')).last();
    const lastReservationOwner = lastReservations.element(by.css('h3')).getText();

    expect(lastReservationOwner).toEqual(`${reservationData.firstName} ${reservationData.lastName}`);
  });
});
