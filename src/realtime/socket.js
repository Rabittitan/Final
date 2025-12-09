// src/realtime/socket.js
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

module.exports = function initSocket(server) {
  const io = new Server(server, { cors: { origin: '*' } });

  io.use((socket, next) => {
    // simple auth via token (optional): socket.handshake.auth?.token
    socket.data.correlationId = uuidv4();
    next();
  });

  io.on('connection', (socket) => {
    logger.info(`Socket connected ${socket.id}`, { cid: socket.data.correlationId });

    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
      logger.info(`Joined user room ${userId}`, { cid: socket.data.correlationId });
    });

    socket.on('join:device', (deviceId) => {
      socket.join(`device:${deviceId}`);
      logger.info(`Joined device room ${deviceId}`, { cid: socket.data.correlationId });
    });

    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected ${socket.id} reason=${reason}`, { cid: socket.data.correlationId });
    });
  });

  function emitSensor(userId, deviceId, metric, value, ts = Date.now()) {
    const payload = { deviceId, metric, value, ts };
    io.to(`user:${userId}`).emit('sensor:data', payload);
    io.to(`device:${deviceId}`).emit('sensor:data', payload);
  }

  function emitAlert(userId, alert) {
    io.to(`user:${userId}`).emit('alert:new', alert);
    io.to(`device:${alert.device_id}`).emit('alert:new', alert);
  }

  function emitDeviceStatus(userId, deviceId, status) {
    io.to(`user:${userId}`).emit('device:status', { deviceId, status });
    io.to(`device:${deviceId}`).emit('device:status', { deviceId, status });
  }

  // Client sends a control command → BE waits for device ack via MQTT → emit back
  function emitCommandAccepted(userId, deviceId, commandId) {
    io.to(`user:${userId}`).emit('command:accepted', { deviceId, commandId });
    io.to(`device:${deviceId}`).emit('command:accepted', { deviceId, commandId });
  }

  function emitCommandAck(userId, deviceId, commandId, ackPayload) {
    io.to(`user:${userId}`).emit('command:ack', { deviceId, commandId, ack: ackPayload });
    io.to(`device:${deviceId}`).emit('command:ack', { deviceId, commandId, ack: ackPayload });
  }

  function emitError(userId, deviceId, error) {
    const payload = { deviceId, error };
    if (userId) io.to(`user:${userId}`).emit('error', payload);
    if (deviceId) io.to(`device:${deviceId}`).emit('error', payload);
  }

  return { io, emitSensor, emitAlert, emitDeviceStatus, emitCommandAccepted, emitCommandAck, emitError };
};
