'use strict';
let constants = require('./constants.js'),
    querystring = require('querystring'),
    telldus = require('./telldusLive').getInstance();

class TelldusClient {
  constructor(id, uuid, name) {
    this.extras = ['coordinate', 'features', 'latestversion', 'suntime', 'timezone', 'transports', 'tzoffset'];
    this.id = id;
    this.uuid = uuid;
    this.name = name;
    this.online = false,
    this.editable = false,
    this.extensions = false;
    this.version = '';
    this.type = '';
    this.longitude = 0;
    this.latitude = 0;
    this.sunrise = 0;
    this.sunset = 0;
    this.timezone = 'UTC';
    this.timezoneAutodetected = true;
    this.tzoffset = 0;
    this.pushEnabled = false;
  }
  
  //alias of getInfo()
  update() {
      this.getInfo();
  }

  getInfo() {
    return telldus.invoke('GET',
                        '/client/getInfo?' + querystring.stringify(
                            { id: this.id, extras: this.extras.join(',')}).then( result =>
        {
          this.uuid = result.uuid;
          this.name = result.name;
          this.online = result.online ? true : false,
          this.editable = result.editable ? true : false,
          this.extensions = result.extensions ? true : false;
          this.version = result.version;
          this.type = result.type;
          this.longitude = result.longitude;
          this.latitude = result.latitude;
          this.sunrise = result.sunrise;
          this.sunset = result.sunset;
          this.timezone = result.timezone;
          this.timezoneAutodetected = result.pushEnabled ? true : false;
          this.tzoffset = result.tzoffset;
          this.pushEnabled = result.pushEnabled ? true : false;
          return this;
        }
      ));
  }
  
 
  setName(name) {
    return telldus.invoke('GET',
                        '/client/setName?' + querystring.stringify(
                            { id: this.id,
                            name: name}).then( result =>
        {
          this.name = name;
          return this;
        }
      ));
  }
  
  setPush(enable) {
    return telldus.invoke('GET',
                        '/client/setPush?' + querystring.stringify(
                            { id: this.id,
                            enable: enable ? '1' : '0'}).then( result =>
        {
          this.pushEnabled = enable;
          return this;
        }
      ));
  }
}

module.exports = TelldusClient;