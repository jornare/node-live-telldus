'use strict';
let config = require('../telldus/config.js'),
    TelldusLive = require('./src/telldusLive.js'),
    telldus = new TelldusLive(config);

/*
telldus.getUser().then(function(user){
  console.log('yeah');
  console.log(user);
});

*/

telldus.getDevices().then(devices => {
  //console.log(devices);
  
  /*devices[0].getInfo().then((device)=>{
    console.log('device', device);
  });*/
  
  devices[1].turnOn().then(device => {
    console.log('device: ', device);
  });
});

//telldus.getSensors(true, true, true).then(sensors => {
 /* sensors[0].update(sensor => {
    console.log(sensor);
  }).catch(err => {
    console.log(err);
  });*/
//});