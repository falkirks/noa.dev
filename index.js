const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const getPositions = require('./apifetch');
const port = process.env.PORT || 5000;

let positions = {};

getPositions(function (err, data) {
  if(!err){
    for(let bus of data){
      positions[bus.id] = bus;
    }
  }
});
setInterval( () => {
  if(io.engine.clientsCount > 0) {
    getPositions((err, data) => {
      if(!err) {
        for(let bus of data){
          if(!positions[bus.id] || bus.time > positions[bus.id].time) {
            io.sockets.emit('bus', bus);
          }
          positions[bus.id] = bus;
        }
      }
    });
  }
}, 5000);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  for(var id in positions){
    socket.emit('bus', positions[id]);
  }
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
