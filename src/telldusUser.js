'use strict';
let constants = require('./constants.js'),
    telldus = require('./telldusLive.js').getInstance(),
    TelldusClient = require('./telldusClient.js'),
    querystring = require('querystring');

class TelldusUser {
  constructor(telldus, data) {
    data = data || {};
    //this.telldus = telldus;
    this.data = data || null;
    this.firstname = data.firstname || '';
    this.lastname = data.lastname || '';
    this.email = data.email || '';
    this.credits = data.credits || 0;
    this.pro = data.pro ? true : false;
    this.locale = data.locale || 'auto';
    this.phones = [];
    this.clients = [];
  }
  
  changePassword(currentPassword, newPassword) {
    return telldus.invoke('GET',
                        '/user/changePassword?' + querystring.stringify({ currentPassword: currentPassword, newPassword: newPassword }).then( result =>
        {
          return this;
        }
      ));
  }
  
  registerPushToken(token, name, model, manufacturer, osVersion, pushServiceId) {
    return telldus.invoke('GET',
                        '/user/registerPushToken?' + querystring.stringify(
                            { token: token,
                            name: name,
                            model: model,
                            manufacturer: manufacturer,
                            osVersion: osVersion,
                            pushServiceId: pushServiceId }).then( result =>
        {
          return this;
        }
      ));
  }
  
  unregisterPushToken(token) {
    return this.telldus.invoke('GET',
                        '/user/unregisterPushToken?' + querystring.stringify(
                            { token: token}).then( result =>
        {
          return this;
        }
      ));
  }
  
  deletePushToken(token) {
    return this.telldus.invoke('GET',
                        '/user/deletePushToken?' + querystring.stringify(
                            { token: token}).then( result =>
        {
          return this;
        }
      ));
  }
  
  getPhones() {
    return this.telldus.invoke('GET',
                        '/user/listPhones').then( result =>
        {
          this.phones = result.phone;
          return this.phones;
        }
      );
  }
  
  getClients() {
    let extras = 'coordinate,features,latestversion,suntime,timezone,transports,tzoffset';
    return this.telldus.invoke('GET',
                        '/clients/list?' + querystring.stringify(
                            { extras: extras})).then( result =>
        {
          //todo:update rather than replace on second call
          this.clients = [];
          result.client.forEach(client => {
              this.clients.push(new TelldusClient(this.telldus, client));
          });
          return this.clients;
        }
      );
  }
}

module.exports = TelldusUser;