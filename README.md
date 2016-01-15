node-live-telldus
=====================

A node.js module to interface with the [Telldus Live API](http://api.telldus.com).
Written in ECMAScript 2015 using classes and promises.
Not complete, but more complete than most other modules.

Before Starting
---------------
You will need a Telldus Live account and OAuth tokens:

- To get a Telldus Live account, go to [login.telldus.com/openid/server](https://login.telldus.com/openid/server)

- Once you have a Telldus Live account, go to [api.telldus.com](http://api.telldus.com/keys/index) and _Generate a private token for my user only_.


Install
-------

    npm install node-live-telldus

API
---

### Configure and instanciate

    let config = {
        publicKey: 'your public key here',
        privateKey: 'your private key here',
        token: 'your token here',
        tokenSecret: 'your token secret here'
    },
    TelldusLive = require('telldus-live-es2015'),
    telldus = new TelldusLive(config);

    telldus.getUser().then(user => {
        console.log(user);
        //the user object is cached for convenience on telldus.user
    }).catch(err => {
        console.log(err); //Error occured
    });


### Get device information

    telldus.getDevices().then((devices)=> {
        //now all devices are fetched and stored in telldus
        
        //no use to call getInfo, as getDevices() fetches all data from devices.
        //convenience methods lets you retrieve cached devices by id or name.
        let myDevice = telldus.getDeviceByName('My device');
        
    });

    //no use to call getInfo, as getDevices() fetches all data from devices.
    //Although, assume it has passed some time, its good to refresh the information.
    //.reload() is an alias of getInfo()
    telldus.getDeviceByName('My device').reload().then(device => {
        //The device info is now fresh, let's do something
        if(device.isOn()) {
            device.turnOff();
        } else {
            device.turnOn();
        }
    });

### Create/Delete device

    telldus.addDevice(client, name, protocol, model); //may not be supported by client

    telldus.removeDevice(device);

### Device actions

    device.setName(name);
    
    device.setModel(model);
    
    device.setParameter(parameter, value);
    
    device.setProtocol(protocol);
    
    device.bell();
    
    device.command(method, value);
    
    device.learn();
    
    device.dim(level);
    
    device.turnOnOff(on);
    
    device.turnOn();
    
    device.turnOff();
    
    device.isOn();
    
    device.stop();
    
    device.isDown();
    
    device.isUp();
    
    device.history(fromTimeStamp, toTimeStamp, extras);

### Get sensor information

    telldus.getSensors(includeIgnored, includeValues, includeScale).then(sensors => {
           //do something with the sensors 
        });
    
    telldus.getSensorById(id); //returns sensor (no server call)
    
    telldus.getSensorByName(name);
    
    sensor.reload().then(...); //alias of sensor.getInfo
    
    sensor.getInfo().then(sensor => { //telldus does not allow this more often than every 10 minutes
        //updated sensor info
        });
    
    sensor.getDataByName(name); //get a named data from the sensor, ie. 'battery'


### Modify sensor

    sensor.setName(name).then(sensor => {
        //new name is now set
        console.log(sensor.name);
        });


### User

    user.changePassword(oldPassword, newPassword);
    
    user.registerPushToken();
    
    user.unregisterPushToken();
    
    user.deletePushToken();
    
    user.getPhones();
    
    user.getClients();
    
### Client (User has clients/locations, not yet implemented)

    client.setName(name);
    
    client.setPush(enable);

### Scheduler

    getJobs()
    
    removeJob(job)

### Job (For scheduler, not yet implemented)

### Group (Not yet implemented/ tested working)

    telldus.addGroup(client, devices, name);
    
    telldus.removeGroup(group)
    
    telldus.getGroupById(id)
    
    telldus.getGroupByName(name)

    goup.id
    
    group.client
    
    group.name
    
    group.devices
    
### Events (Not finished)
