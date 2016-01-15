'use strict';
let constants = require('./constants.js');

class TelldusGroup {
  constructor(telldus, data) {
    data = data || {};
    this.telldus = telldus;
    this.id = 
    this.client = null;
    this.name = '';
    this.devices = [];
  }
}

module.exports = TelldusGroup;