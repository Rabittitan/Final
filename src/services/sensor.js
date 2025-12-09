module.exports = function sensorService(influx, alertService, deviceService) {
  async function ingest(topic, msg) {
    const friendlyName = topic.split('/')[1];
    const device = await deviceService.getByFriendlyName(friendlyName);
    if (!device) return;

    const metrics = ['temperature','humidity','battery','linkquality'];
    const points = [];

    metrics.forEach(metric => {
      if (msg[metric] !== undefined) {
        points.push({
          measurement: 'sensor_data',
          tags: { device_id: device._id.toString(), metric },
          fields: { value: Number(msg[metric]) },
          timestamp: Date.now()
        });
        alertService.evaluate(device, metric, Number(msg[metric]));
      }
    });

    influx.write.writePoints(points);
  }

  async function query(deviceId, metric, timeRange) {
    const q = `
      from(bucket: "${influx.bucket}")
        |> range(start: ${timeRange})
        |> filter(fn: (r) => r.device_id == "${deviceId}" and r.metric == "${metric}")
    `;
    return influx.query.collectRows(q);
  }

  return { ingest, query };
};

//emitSensor(device.owner, device._id, metric, value);
