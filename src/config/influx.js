const { InfluxDB } = require('@influxdata/influxdb-client');

module.exports = function influxClient({ url, token, org, bucket }) {
  const client = new InfluxDB({ url, token });
  const write = client.getWriteApi(org, bucket, 'ms');
  const query = client.getQueryApi(org);
  console.log('[InfluxDB] Client initialized');
  return { client, write, query, bucket };
};
