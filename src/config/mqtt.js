const mqtt = require('mqtt');

module.exports = function connectMqtt({ host, username, password, tls }) {
  const opts = {
    username,
    password,
    protocol: tls ? 'mqtts' : 'mqtt'
  };
  const client = mqtt.connect(host, opts);

  client.on('connect', () => console.log('[MQTT] Connected'));
  client.on('error', (err) => console.error('[MQTT] Error:', err.message));

  return client;
};
