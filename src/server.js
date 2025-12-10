const express = require('express');
const http = require('http');
const cors = require('cors');

// Config
const env = require('./config/env');
const connectMongo = require('./config/mongo');
const influxClient = require('./config/influx');
const connectMqtt = require('./config/mqtt');

// Routes
const routes = require('./routes/index');

// Middlewares
const errorMiddleware = require('./middlewares/error');
const correlation = require('./middlewares/correlation');
const requestLogger = require('./middlewares/requestLogger');

// Realtime
const initSocket = require('./realtime/socket');

// Services
const userService = require('./services/user');
const coordinatorService = require('./services/coordinator');
const deviceService = require('./services/device');
const alertService = require('./services/alert');
const firmwareService = require('./services/firmware');
const sensorServiceFactory = require('./services/sensor');
const mqttDispatcherFactory = require('./services/mqttDispatcher');


const logger = require('./utils/logger');

(async () => {
  try {
    // 1. Kết nối DB
    await connectMongo(env.mongoUri);
    const influx = influxClient(env.influx);

    // 2. Kết nối MQTT
    const mqtt = connectMqtt(env.mqtt);

    // 3. Khởi tạo Express + HTTP + Socket.IO
    const app = express();
    const server = http.createServer(app);
    const socket = initSocket(server);

    // 4. Khởi tạo services (inject dependencies)
    const sensorService = sensorServiceFactory(influx, alertService, deviceService);
    const mqttDispatcher = mqttDispatcherFactory(mqtt, { sensorService, deviceService ,coordinatorService});

    
    // 5. Middleware
    app.use(cors());
    app.use(express.json());
    app.use('/api', routes);
    app.use(correlation);
    app.use(requestLogger);
    app.use(errorMiddleware);
    
    

    // 6. Start server
    server.listen(env.port, () => {
      console.log(`[Server] Running on port ${env.port}`);
      console.log('Mongo connected', { component: 'DB' });
      logger.info('Server started successfully', { component: 'SERVER' });
      
     

    });

  } catch (err) {
    console.error('[Server] Startup error:', err);
    process.exit(1);
  }
})();
