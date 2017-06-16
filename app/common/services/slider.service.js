export default class Table {
  constructor() {
    'ngInject';
  }

  getOptions() {
    return {
      options: {
        disabled: false,
        floor: 1,
        ceil: 96,
        step: 1,
        minRange: 1,
        pushRange: true,
        draggableRange: true,
        noSwitching: true,
        hideLimitLabels: true,
        translate: (val) => {
          let min = '00';
          switch(val % 4) {
            case 1: {
              min = '15'
              break;
            }
            case 2: {
              min = '30'
              break;
            }
            case 3: {
              min = '45'
              break;
            }
          }
          
          return Math.floor(val/4) + ':' + min;
        }
      }
    }
  }

  to15Min(time, round=true) {
    let arr = time.split(':');
    return arr[0]*4 + (round ? Math.round(arr[1]/15) : Math.floor(arr[1]/15)) || 1;
  }

  from15Min(min15) {
    let hours = this.to2Digits(Math.floor(min15/4));
    let mins  = this.to2Digits((min15%4)*15);
    return [hours,mins].join(':');
  }

  to2Digits(dig) {
    return (dig < 10 ? '0' : '') + dig;
  }
}
