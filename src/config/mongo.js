const mongoose = require('mongoose');

module.exports = async function connectMongo(uri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);   // bỏ hết option cũ
  console.log('[MongoDB] Connected');
  return mongoose.connection;
};
