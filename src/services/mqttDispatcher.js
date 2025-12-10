// src/services/mqttDispatcher.js
const logger = require('../utils/logger');

console.log('mqttDispatcher service loaded');

module.exports = function mqttDispatcher(mqttClient, { sensorService, deviceService, alertService, socket,coordinatorService }) {
  mqttClient.subscribe('zigbee2mqtt/#', (err) => {
    if (err) logger.error('MQTT subscribe error', { err });
  });

  mqttClient.on('message', async (topic, buf) => {
    const raw = buf.toString();
    // thêm dòng này
    const msg = safeJson(raw);

    //tesst 
    const { zcId, ieee_address, friendly_name, device_type } = msg;
    // const coordinator = await deviceService.getCoordinatorById(zcId);
    // console.log('[MQTT Dispatcher] Coordinator lookup result', { zcId, coordinator });
    // console.log(coordinator);

    try {
      if (topic === 'zigbee2mqtt/bridge/event' && msg.type === 'device_joined') {
        const { zcId, ieee_address, friendly_name, device_type } = msg;
        console.log('[MQTT Dispatcher] Device joined event', msg);

        const coordinator = await coordinatorService.getById(zcId);
        if (!coordinator) {
          logger.warn('Coordinator not found, device not created', { zcId });
          return;
        }
        
        console.log(coordinator);
        console.log(coordinator._id);
        console.log("demo tao device");
        // Create device record
        const created = await deviceService.create({
          zc_id: zcId,
          ieee_address,
          friendly_name,
          device_type,
          status: 'active',
        });
        console.log('[MQTT Dispatcher] Device created', created);
        logger.info('Device created', { friendly_name, zcId, deviceId: created?._id });
        return;
      }


      if (topic.endsWith('/availability')) {
        const friendly = topic.split('/')[1];
        await deviceService.updateAvailability(friendly);
        const device = await deviceService.getByFriendlyName(friendly);
        if (device) socket.emitDeviceStatus(device.owner, device._id, 'online');
        return;
      }

      if (topic.endsWith('/log')) {
        const friendly = topic.split('/')[1];
        const device = await deviceService.getByFriendlyName(friendly);
        if (device) await deviceService.ingestLog(device._id, msg);
        return;
      }

      // Device ACK for commands: zigbee2mqtt/<friendly>/ack
      if (topic.endsWith('/ack')) {
        const friendly = topic.split('/')[1];
        const device = await deviceService.getByFriendlyName(friendly);
        const commandId = msg.commandId || msg.cid;
        if (device) socket.emitCommandAck(device.owner, device._id, commandId, msg);
        return;
      }

      // Normalize sensor payload
      await sensorService.ingest(topic, normalizeSensor(msg, Date.now()));
    } catch (err) {
      console.error('[MQTT Dispatcher] Error processing message', err);
      logger.error('MQTT message processing error', { err, topic, raw });
    }
  });

  // Publish command and emit accepted, then wait for ack via on('message')
  async function publishSet(friendlyName, userId, deviceId, data) {

    console.log('Publishing MQTT set command', { friendlyName, data });
    const commandId = genCid();
    const payload = { ...data, cid: commandId, ts: Date.now() };
    const t = `zigbee2mqtt/${friendlyName}/set`;

    mqttClient.publish(t, JSON.stringify(payload), {}, (err) => {
      if (err) {
        logger.error('MQTT publish error', { err, topic: t, payload });
      } else {
        logger.info('MQTT publish success', { topic: t, payload });
      }
    });

    socket.emitCommandAccepted(userId, deviceId, commandId);
    return commandId;
  }

  return { publishSet };
};

function safeJson(s) {
  try { return JSON.parse(s); } catch { return { raw: s }; }
}

function genCid() {
  return Math.random().toString(36).slice(2, 10);
}

function normalizeSensor(msg, ts) {
  const map = {
    temperature: 'temperature',
    humidity: 'humidity',
    battery: 'battery',
    linkquality: 'linkquality',
    pressure: 'pressure',
    voltage: 'voltage',
    current: 'current'
  };
  const out = { ts };
  for (const k of Object.keys(map)) {
    if (msg[k] !== undefined) out[k] = Number(msg[k]);
  }
  // include original keys minimally
  if (msg.state) out.state = msg.state;
  return out;
}
