# homebridge-udp-switch

UDP server switch input plugin for [Homebridge](https://github.com/nfarina/homebridge)

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin `npm install -g homebridge-udp-contactsensor`
3.	Update your configuration file - see below for an example

## Configuration
* `accessory`: "UdpSwitch"
* `name`: descriptive name
* `listen_port`: UDP port to listen on for incoming messages
* `mac`: Self-announced MAC address of the transmitting switch (really, any 6 bytes), as a hex-encoded string

Example configuration:

```json
    "accessories": [
        {
            "accessory": "UdpSwitch",
            "name": "UDP Switch",
            "listen_port": 8266,
            "mac": "0102030A0B0C"
        }
    ]
```

Listens for UDP datagrams on port 8266, turns on upon receiving the MAC followed by a 0xFF byte; turns it off when receiving the MAC followed by a 0x00 byte.

If you dig in the code a bit, you can see a trivial way to make this function as a stateless programmable switch.

## See also

* [homebridge-http-programmableswitch](https://github.com/jnvaldenaire/homebridge-http-programmableswitch)
* [homebridge-contactsensor](https://github.com/rxseger/homebridge-contactsensor)
* [homebridge-dash](https://github.com/steve228uk/homebridge-dash)

## License

MIT

