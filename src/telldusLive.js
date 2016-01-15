'use strict';
/* global process */
// a node.js module to interface with the Telldus Live API
//   cf., http://api.telldus.com
let events      = require('events'),
    oauth       = require('oauth'),
    querystring = require('querystring'),
    underscore  = require('underscore'),
    util        = require('util'),
    TelldusSensor = require('./telldusSensor.js'),
    TelldusDevice = require('./telldusDevice.js'),
    TelldusUser = require('./telldusUser.js'),
    TelldusClient = require('./telldusClient.js'),
    TelldusGroup = require('./telldusGroup.js'),
    TelldusEvent = require('./telldusEvent.js'),
    constants = require('./constants.js'),
    instance = null;



class TelldusLive {
  constructor(options) {
    if(!options || ! options.token || options.token.length < 30) {
        console.log('You need to update your configuration file');
        process.exit(1);
    }
    this.options = options;    
    this.oauth = new oauth.OAuth(null, null, this.options.publicKey, this.options.privateKey, '1.0', null, 'HMAC-SHA1');
    this.user = new TelldusUser(this);
    this.clients = [];
    this.devices = [];
    this.devicesByIdIndex = {};
    this.devicesByNameIndex = {};
    this.sensors = [];
    this.sensorsByIdIndex = {};
    this.sensorsByNameIndex = {};
    this.groups = [];
    this.groupsByIdIndex = {};
    this.groupsByNameIndex = {};
    this.events = [];
    this.eventsByIdIndex = {};
    instance = this;
    return this;
  }
  
  static getInstance() {
      return instance;
  }
  
  invoke(method, path, json) {
    return new Promise((resolve, reject) => {
      this.oauth._performSecureRequest(this.options.token, this.options.tokenSecret, method, 'https://api.telldus.com/json' + path, null, json,
        !!json ? 'application/json' : null, function(err, body, response) {
          let result,
              expected = { GET    : [ 200 ],
                           PUT    : [ 200 ],
                           POST   : [ 200, 201, 202 ],
                           DELETE : [ 200 ]
                        }[method];
          if(!!err) {
            return reject(new Error(response.statusCode + ' ' + (err && err.message && err.message)));//err, response.statusCode);
          }
          
          try {
            result = JSON.parse(body);
          } catch(ex) {
            //self.logger.error(path, { event: 'json', diagnostic: ex.message, body: body });
            return reject(new Error('Parse error'));//ex, response.statusCode);
          }
          if (expected.indexOf(response.statusCode) === -1) {
            //self.logger.error(path, { event: 'https', code: response.statusCode, body: body });
            return reject(new Error('HTTP response ' + response.statusCode), response.statusCode, result);
          }
          
          resolve(result);
        });
    });
  }
  
  getUser() {
      return this.invoke('GET', '/user/profile').then( result =>
        {
          this.user = new TelldusUser(this, result);
          return this.user;
        }, err => {
          console.log(err);
        }
      );
  }
  
  getClientById(id) {
    return this.clients.find((client) => {
      return client.id == id;
    });
  }
  
  addClient(id, uuid) {
    return this.telldus.invoke('GET',
                        '/client/register?' + querystring.stringify(
                            { id: id,
                            uuid: uuid }).then( result =>
        {
          let client = new TelldusClient(this.telldus, id, uuid, uuid);
          this.clients.push(client);
          return client;
        }
      ));
  }

  getSensors(includeIgnored, includeValues, includeScale) {
    let params = querystring.stringify({ includeIgnored: includeIgnored ? '1' : '0', includeValues: includeValues ? '1' : '0', includeScale: includeScale ? '1' : '0'});
    return this.invoke('GET', '/sensors/list?' + params).then( result =>
        {
          console.log(result);
          result.sensor.forEach(s => {
            let sensor = new TelldusSensor(this, s);
            this.sensors.push(sensor);
            this.sensorsByIdIndex[sensor.id] = sensor;
            this.sensorsByNameIndex[sensor.name] = sensor;
          });
          return this.sensors;
        }
      );
  }
  
  getDevices() {
    return this.invoke('GET', '/devices/list?' + querystring.stringify({ supportedMethods: constants.SUPPORTED_METHODS, extras: constants.EXTRAS })).then( result =>
        {
          result.device.forEach(d => {
            let device = new TelldusDevice(this, d);   
            this.devices.push(device);
            this.devicesByIdIndex[device.id] = device;
            this.devicesByNameIndex[device.name] = device;
          });
          return this.devices;
        }
      );
  }
  
  getDeviceById(id) {
    return this.devicesByIdIndex[id] || null;
  }
  
  getDeviceByName(name) {
    return this.devicesByNameIndex[name] || null;
  }
  
  getSensorById(id) {
    return this.sensorsByIdIndex[id] || null;
  }
  
  getSensorByName(name) {
    return this.sensorsByNameIndex[name] || null;
  }
  
  //may not be supported by client
  addDevice(client, name, protocol, model) {
    return this.invoke('GET', '/device/add?' + querystring.stringify(
        {
            client: client.id,
            name: name,
            protocol: protocol,
            model: model })).then( result =>
        {
            let device = new TelldusDevice(this, result);
            this.devices.push(device);
            this.devicesByIdIndex[device.id] = device;
            this.devicesByNameIndex[device.name] = device;
            return device;
        }
      );
  }
  
  removeDevice(device) {
    return this.invoke('DELETE', '/device/remove?' + querystring.stringify({id: device.id })).then(result => {
      delete this.devicesByIdIndex[device.id];
      delete this.devicesByNameIndex[device.name];
      this.devices.splice(this.devices.indexOf(device), 1);
    });
  }

  addGroup(client, devices, name) {
    let deviceIds = [];
    devices.forEach(device => {
       deviceIds.push(device.id); 
    });
    return this.invoke('GET', '/group/add?' + querystring.stringify(
        {
            client: client.id,
            devices: deviceIds.join(','),
            name: name })).then( result =>
        {
            let group = new TelldusGroup(client, devices, name);
            this.groups.push(group);
            this.groupsByIdIndex[group.id] = group;
            this.groupsByNameIndex[group.name] = group;
            return group;
        }
      );
  }
  
  removeGroup(group) {
    return this.invoke('DELETE', '/group/remove?' + querystring.stringify({id: group.id })).then(result => {
      delete this.groupsByIdIndex[group.id];
      delete this.groupsByNameIndex[group.name];
      this.groups.splice(this.devices.indexOf(group), 1);
    });
  }  
  
  getEvents() {
    return this.invoke('GET', '/events/list?listOnly=1').then( result =>
        {
          result.event.forEach(e => {
            let event = new TelldusEvent(this, e);   
            this.events.push(event);
            this.eventsByIdIndex[event.id] = event;
          });
          return this.events;
        }
      );
  }
  
  getEventById(id) {
    return this.eventsByIdIndex[id] || null;
  }
  
}

module.exports = TelldusLive;