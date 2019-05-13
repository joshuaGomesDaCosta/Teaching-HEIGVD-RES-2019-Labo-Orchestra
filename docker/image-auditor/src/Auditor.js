var dgram = require('dgram');
var net = require('net');
const moment = require('moment');

moment().format();

//Repris de thermomètre
var PROTOCOL_PORT = 2205;
var PROTOCOL_MULTICAST_ADDRESS = "239.255.22.5";

//Repris de thermomètre
var s = dgram.createSocket('udp4');
s.bind(PROTOCOL_PORT, function () {
    console.log("Joining multicast group");
    s.addMembership(PROTOCOL_MULTICAST_ADDRESS);
});

//Liste des instruments
var instruments = new Map();

instruments.set("ti-ta-ti", "piano");
instruments.set("pouet", "trumpet");
instruments.set("trulu", "flute");
instruments.set("gzi-gzi", "violin");
instruments.set("boum-boum", "drum");

//Liste des musiciens
var actives = new Array();
var musiciens = new Map();

s.on('message', function (msg, source) {

    var musicianTmp = JSON.parse(msg);

    if (!musiciens.has(musicianTmp.uuid)) {
        var musician = new Object();
        musician.uuid = musicianTmp.uuid;
        musician.instrument = instruments.get(musicianTmp.sound);
        musician.activeSince = moment();
        musician.active = true;

        musiciens.set(musician.uuid, musician);
    } else {
        musiciens.get(musicianTmp.uuid).active = true;
    }
});

setInterval(function () {

    actives = new Array();

    musiciens.forEach(function forAll(value,key, map){
        if(musiciens.get(key).active){

            var musicianTMP = new Object();
            musicianTMP.uuid = musiciens.get(key).uuid;
            musicianTMP.instrument = musiciens.get(key).instrument;
            musicianTMP.activeSince = musiciens.get(key).activeSince;

            actives.push(musicianTMP);
            musiciens.get(key).active = false;
        }
	});

    console.log( JSON.stringify(actives));



}, 3000);

//Partie TCP
var server = net.createServer(function (socket) {
        var payload = JSON.stringify(actives);
        socket.write(payload + '\r\n');
        socket.pipe(socket);
        socket.end();
});

server.listen(2205, '0.0.0.0');

