var dgram = require('dgram');
const uuidv1 = require('uuid/v1');
var s = dgram.createSocket('udp4');

//Repris de thermomètre
var PROTOCOL_PORT = 2205;
var PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";

//Selon git
var instruments = new Map();

instruments.set("piano", "ti-ta-ti");
instruments.set("trumpet", "pouet");
instruments.set("flute", "trulu");
instruments.set("violin", "gzi-gzi");
instruments.set("drum", "boum-boum");

var instrument = new Object();

instrument.sound = instruments.get(process.argv[2]);
instrument.uuid = uuidv1();

console.log(instrument.sound);

var payload = JSON.stringify(instrument);

message = new Buffer(payload);

setInterval(function () {

    s.send(message, 0, message.length, PROTOCOL_PORT, PROTOCOL_MULTICAST_ADDRESS, function (err, bytes) {
        console.log("Sending payload: " + payload + "via port " + s.address().port);
    })
}, 1000);

