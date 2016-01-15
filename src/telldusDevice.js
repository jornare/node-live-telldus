'use strict';
let querystring = require('querystring'),
    constants = require('./constants');

class TelldusDevice {
  constructor(telldus, data) {
    this.telldus = telldus;
    this.populate(data || {});
  }
  //private
  populate(data) {
    this.id = data.id;
    this.clientDeviceId = data.clientDeviceId || null;
    this.name = data.name || '';
    this.status = constants.METHODS[data.state] || 'off';
    this.state = data.state;
    this.statevalue = data.statevalue || null;
    this.methods = data.methods;
    this.type = data.type || 'device';
    this.online = data.online ? true : false;
    this.editable = data.editable ? true : false;
    this.parameter = data.parameter || [];
    //extras
    this.latitude = data.latitude || 0;
    this.longitude = data.longitude || 0;
    this.timezone = data.timezone || '';
    this.timezoneAutodetected= data.timezoneAutodetected ? true: false;
    this.tzoffset = data.tzoffset || 0;
    this.transport = data.transport || '';
    
    if(data.hasOwnProperty('client')) {
      this.client = this.telldus.getClientById(data.client);
      if(!this.client) {
        this.client = this.telldus.addClient(data.client, data.clientName);
      }
    }   
  }

  reload() {
    this.getInfo();
  }
  
  getInfo() {
    let extras = 'coordinate,timezone,transport,tzoffset';
    return this.telldus.invoke('GET', '/device/info?' + querystring.stringify({ id               : this.id
                                                                              , supportedMethods : constants.SUPPORTED_METHODS,
                                                                              extras: extras
                                                                              })).then( data =>
        {
          data.hasOwnProperty('clientDeviceId') && (this.clientDeviceId = data.clientDeviceId);
          data.hasOwnProperty('name') && (this.name = data.name);
          data.hasOwnProperty('state') && (this.status = constants.METHODS[data.state] || 'off');
          data.hasOwnProperty('state') && (this.state = data.state);
          data.hasOwnProperty('statevalue') && (this.statevalue = data.statevalue);
          data.hasOwnProperty('methods') && (this.methods = data.methods);
          data.hasOwnProperty('type') && (this.type = data.type);
          data.hasOwnProperty('online') && (this.online = data.online ? true : false);
          data.hasOwnProperty('editable') && (this.editable = data.editable ? true : false);
          data.hasOwnProperty('parameter') && (this.parameter = data.parameter);
          //extras
          data.hasOwnProperty('latitude') && (this.latitude = data.latitude);
          data.hasOwnProperty('longitude') && (this.longitude = data.longitude);
          data.hasOwnProperty('timezone') && (this.timezone = data.timezone);
          data.hasOwnProperty('timezoneAutodetected') && (this.timezoneAutodetected = data.timezoneAutodetected);
          data.hasOwnProperty('tzoffset') && (this.tzoffset = data.tzoffset);
          data.hasOwnProperty('transport') && (this.transport = data.transport);
          
          if(data.hasOwnProperty('client')) {
            this.client = this.telldus.getClientById(data.client);
            if(!this.client) {
              this.client = this.telldus.addClient(data.client, data.clientName);
            }
          }
          return this;
        }
      );
  };  
  
  setStatus(status) {
    if (!constants.methods[status]) {
      return false;
    }
    this.status = status;
    this.state = constants.methods[status];
    return true;
  }
  
  setName(name) {
    return this.telldus.invoke('GET',
                        '/device/setName?' + querystring.stringify({ id: this.id, name: name })).then( result =>
        {
          this.name = name;
          return this;
        }
      );
  };
  
 
  setModel(model) {
    return this.telldus.invoke('GET', '/device/setModel?' + querystring.stringify({ id: this.id,
                                                                                    model: model }));
  }
  
  setParameter(parameter, value) {
    return this.telldus.invoke('GET',
                        '/device/setParameter?' + querystring.stringify({ id: this.id, parameter: parameter, value: value })).then( result =>
        {
          this.parameters[parameter] = value;
          return this;
        }
      );
  }
  
  setProtocol(protocol) {
    return this.telldus.invoke('GET',
                        '/device/setProtocol?' + querystring.stringify({ id: this.id, protocol: protocol})).then( result =>
        {
          return this;
        }
      );
  }
  
  bell() {
    return this.telldus.invoke('GET',
                        '/device/bell?' + querystring.stringify({ id: this.id})).then( result =>
        {
          this.setStatus('bell');
          return this;
        }
      );
  }
  
  command(method, value) {
    //if (!exports.commands[method]) return callback(new Error('unknown method: ' + method));
    return this.telldus.invoke('GET',
                        '/device/command?' + querystring.stringify({ id: this.id, method: method, value: value })).then( result =>
        {
          return this;
        }
      );
  }

  learn() {
    return this.telldus.invoke('GET', '/device/learn?' + querystring.stringify({ id: this.id })).then( result =>
        {
          return this;
        }
      );
  }  
  
  dim(level) {
    return this.telldus.invoke('GET',
                        '/device/dim?' + querystring.stringify({ id: this.id, level: level})).then( result =>
        {
          this.setStatus('dim');
          return this;
        }
      );
  }
  
  turnOnOff(on) {
    return this.telldus.invoke('GET',
                        '/device/turn' + (on ? 'On' : 'Off') + '?' + querystring.stringify({ id: this.id})).then( result =>
        {
          this.setStatus(on ? 'on' : 'off')
          return this;
        }
      );
  }
  
  turnOn() {
    return this.turnOnOff(true);
  }
  
  turnOff() {
    return this.turnOnOff(false);
  }
  
  isOn() {
    return this.status == 'on';
  }
  
  stop() {
    return this.telldus.invoke('GET',
                        '/device/stop?' + querystring.stringify({ id: this.id})).then( result =>
        {
          this.setStatus('off');
          return this;
        }
      );
  }
  
  upDown(up) {
    return this.telldus.invoke('GET',
                        '/device/' + (up ? 'up' : 'down') + '?' + querystring.stringify({ id: this.id})).then( result =>
        {
          return this;
        }
      );
  }
  
  up() {
    return this.upDown(true);
  }
  
  down() {
    return this.upDown(false);
  }
  
  isUp() {
    return this.status == 'up';
  }
  
  history(fromTimestamp, toTimestamp, extras) {
    let _extras = extras || 'timezone,tzoffset';
    return this.invoke('POST',
        '/device/history?' + querystring.stringify({ id: this.id,
                                                    'from': fromTimestamp,
                                                    to: toTimestamp,
                                                    extras: _extras
                                                })).then( result =>
        {
          return result;
        }
      );
  }
  
}

module.exports = TelldusDevice;