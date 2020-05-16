const GtfsRealtimeBindings = require('gtfs-realtime-bindings');
const request = require('request');

let requestSettings = {
  method: 'GET',
  url: 'https://gtfs.translink.ca/v2/gtfsposition?apikey=' + process.env.TRANSLINK_API_KEY,
  encoding: null
};

function getPositions(cb){
  request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
      var res = [];
      feed.entity.forEach(function(entity) {
        if (entity.vehicle) {
          res.push({id: entity.vehicle.vehicle.id, lat: entity.vehicle.position.latitude, lon: entity.vehicle.position.longitude, time: entity.vehicle.timestamp})
        }
      });
      cb(null, res);
    } else {
      cb(error, null);
    }
  });
}
module.exports = getPositions;
