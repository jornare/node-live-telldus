'use strict';
let querystring = require('querystring');

class TelldusSensor {
  constructor(telldus, data) {
    this.telldus = telldus;
    this.id = data.id;
    this.sensorId = data.sensorId;    
    this.name = data.name;
    this.lastUpdated = data.lastUpdated;
    this.ignored = data.ignored ? true : false;
    this.online = data.online ? true : false;
    this.editable = data.editable ? true : false;
    this.battery = data.battery;
    this.keepHistory = data.keepHistory ? true : false;
    this.protocol = data.protocol;
    this.model = data.model;
    this.data = data.data || [];
    if(data.hasOwnProperty('client')) {
      this.client = this.telldus.getClientById(data.client);
      if(!this.client) {
        this.client = this.telldus.addClient(data.client, data.clientName);
      }
    }
  }
  
  getDataByName(name) {
    return this.data.find(d => {
      return d.name == name;
    });
  }
  //Telldus does not allow this method to be called more often than every 10 minutes
  //alias for getInfo()
  reload() {
    return this.getInfo();
  }
  //Telldus does not allow this method to be called more often than every 10 minutes
  getInfo() {
    return this.telldus.invoke('GET', '/sensor/info?' + querystring.stringify({ id: this.id })).then( result =>
        {
          this.name = result.name;
          this.lastUpdated = result.lastUpdated;
          this.ignored = result.ignored;
          this.editable = result.editable;
          this.battery = result.battery;
          this.keepHistory = result.keepHistory;
          this.data = result.data;
          
          console.log(result);
          //this.sensors = result.sensor;
          return this;
        }
      );
  }
  
  setName(name) {
    return this.telldus.invoke('GET',
                        '/sensor/setName?' + querystring.stringify({ id: this.id, name: name }).then( result =>
        {
          this.name = name;
          return this;
        }
      ));
  };
  
  setIgnore() {
    
  }
}

module.exports = TelldusSensor;