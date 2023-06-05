const request = require("request");

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIp = function (callback) {
  request("https://api.ipify.org?format=json", (err, resp, body) => {
    if (err) {
      callback(`Error: Unable to obtain the IP from ipify.org.\n ${err}.`);
    } else if (resp.statusCode !== 200) {
      callback(
        `Error: Unable to obtain the IP from ipify.org.\n Status Code: ${resp.statusCode}.\n Response: ${body}`
      );
    } else {
      const ip = JSON.parse(body).ip;
      if (ip) {
        callback(null, ip);
      } else {
        callback("Error: Could not obtain yout IP address");
      }
    }
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) => {
    if (error)
      return callback(
        "There has been an error retrieving coordinates: " + error,
        null
      );

    if (response.statusCode !== 200) {
      callback(
        Error(
          `Status Code ${response.statusCode} when fetching coordinates: ${body}`
        ),
        null
      );
      return;
    }

    const lat = JSON.parse(body).data.latitude;
    const lon = JSON.parse(body).data.longitude;
    const coords = {
      lat: lat,
      lon: lon,
    };
    callback(null, coords);
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };
