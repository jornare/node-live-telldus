'use strict';
let constants = require('./constants.js');

class TelldusTrigger {
    constructor() {
        this.id = 0;
        this.edge = 1;
        this.value = 0;
        this.sensorId = 0;
        this.reloadValue = 0;
        this.valueType = '';
        this.scale = 0;
    }
}

class TelldusCondition {
    constructor() {
        this.toMinute = 0;
        this.toHour = 0;
        this.fromMinute = 0;
        this.fromHour = 0;
        this.id = 0;
        this.type = '';
        this.group = 0;
    }
}

class TelldusAction {
    constructor() {
        this.repeats = 1;
        this.method = 0;
        this.deviceId = 0;
        this.id = 0;
        this.type = 'device';
        this.delay = 0;
        this.delayPolicy = 'continue';
    }
}

class TelldusEvent {
  constructor(data) {
    data = data || {};
    this.description = data.description || '';
    this.minRepeatInterval = data.minRepeatInterval || 0;
    this.active = data.active ? true : false;
    this.triggers = [];
    this.conditions = [];
    this.actions = [];
  }
  
  getInfo() {
      
  }
  
  //adds or updates an event to the system. Adds if id == 0
  setEvent() {
      
  }
  
  setBlockHeaterTrigger() {
      
  }
  
  setDeviceAction() {
      
  }
  
  setDeviceCondition() {
      
  }
  
  setDeviceTrigger() {
      
  }
  
  setEmailAction() {
      
  }
  
  setPushAction() {
      
  }
  
  setSMSAction() {
      
  }
  
  setSensorCondition() {
      
  }
  
  setSensorTrigger() {
      
  }
  
  setSuntimeCondition() {
      
  }
  
  setSuntimeTrigger() {
      
  }
  
  setTimeCondition() {
      
  }
  
  setURLAction() {
      
  }
  
  setWeekdaysCondition() {
      
  }
  
  removeAction() {
      
  }
  
  removeCondition() {
      
  }
  
  removeTrigger() {
      
  }
}

module.exports = TelldusEvent;