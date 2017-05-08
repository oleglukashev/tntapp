export default class SettingsMailsEditMailCtrl {
  constructor(item) {
    'ngInject';

    this.item  = item;
    this.types = {
      'na_bezoek'                 :'Mail ne bezoek',
      'reservering_bevestigd'     :'Bevestigingsmail',
      'reservering_niet_mogelijk' :'Reservering niet mogelijk',
      'reservering_ontvangen'     :'Aanvraag'
    }
  }
}