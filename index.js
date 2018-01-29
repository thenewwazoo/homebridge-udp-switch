'use strict';

const dgram = require('dgram');

let Service, Characteristic;

module.exports = (homebridge) => {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-udpswitch', 'UdpSwitch', UdpSwitch);
};

function UdpSwitch(log, config, api) {

    this.log = log;
    this.name = config.name;
    this.config = config;
    this.mac = config.mac.toUpperCase();
    this.listen_port = config.listen_port || 8266;
    this.isOn = false;

    this.infoService = new Service.AccessoryInformation();
    this.infoService
        .setCharacteristic(Characteristic.Manufacturer, 'Optimal Tour')
        .setCharacteristic(Characteristic.Model, 'UDP Switch')
        .setCharacteristic(Characteristic.SerialNumber, this.mac);

    this.stateService = new Service.Switch();

/*
    this.onButton = new Service.StatelessProgrammableSwitch("On Button", "On Button");
    this.offButton = new Service.StatelessProgrammableSwitch("Off Button", "Off Button");

    this.onButton.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
        .setProps({maxValue: 0});
    this.onButton.getCharacteristic(Characteristic.ServiceLabelIndex).setValue(1);

    this.offButton.getCharacteristic(Characteristic.ProgrammableSwitchEvent)
        .setProps({maxValue: 0});
    this.offButton.getCharacteristic(Characteristic.ServiceLabelIndex).setValue(2);
*/

    this.stateService.getCharacteristic(Characteristic.On, this.isOn)
        .on('get', this.getState.bind(this))
     // .on('set', this.setState.bind(this))
        .setProps({perms: [Characteristic.Perms.READ
                         , Characteristic.Perms.NOTIFY
                      // , Characteristic.Perms.WRITE
                          ]});

    this.server = dgram.createSocket('udp4');

    this.server.on('error', (err) => {
        console.log(`udp server error:\n${err.stack}`);
        server.close();
    });

    this.server.on('message', (msg, rinfo) => {
        const mac = msg.slice(0,6).toString('hex').toUpperCase();
        const msg_byte = msg[6];
        console.log(`UDP msg from ${rinfo.address}`);

        if (mac == this.config.mac) {
            if (msg_byte == 0xFF) {
                console.log(`mac ${mac} is on!`);
                this.isOn = true;
                //this.onButton.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(0);
            } else if (msg_byte == 0x00) {
                console.log(`mac ${mac} is off!`);
                this.isOn = false;
                //this.onButton.getCharacteristic(Characteristic.ProgrammableSwitchEvent).updateValue(1);
            } else {
                console.log(`unknown msg from mac ${mac}`);
            }
        }
        else
        {
            console.log(`unknown mac ${mac}`);
        }

        this.stateService.getCharacteristic(Characteristic.On, this.on).updateValue(this.isOn);
    });

    this.server.bind(this.listen_port);
}

UdpSwitch.prototype.identify = function(callback) {
    this.log('Identify requested!');
    callback();
};

UdpSwitch.prototype.getServices = function() {
    //return [this.infoService, this.onButton, this.offButton];
    return [this.infoService, this.stateService];
};

UdpSwitch.prototype.getState = function(callback) {
    return callback(null, this.isOn);
};
