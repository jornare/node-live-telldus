'use strict';
let constants = require('./constants.js');

class TelldusJob {
  constructor(telldus, data) {
    data = data || {};
    this.telldus = telldus;

    this.id = data.id || 0;
    this.device = data.device || null; //todo: if id is given, get actual device
    this.method = data.method || '';
    this.methodValue = data.methodValue || '';
    this.type = data.type || '';
    this.hour = data.hour || 0;
    this.minute = data.minute || 0;
    this.offset = data.offset || 0;
    this.randomInterval = data.randomInterval || 0;
    this.retries = data.retries || 0;
    this.retryInterval = data.retryInterval || 0;
    this.reps = data.reps || 0;
    this.active = data.active ? true :false;
    this.weekdays = data.weekdays || '';
  }
  
  getInfo() {
      
  }
}

module.exports = TelldusJob;