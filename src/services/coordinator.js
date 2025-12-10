const Coordinator = require('../models/coordinator');


async function listByUser(userId){
  return Coordinator.find({ user_id: userId });
};

async function add(userId, data){
  return Coordinator.create({ ...data, user_id: userId });
};


async function getById(zcId) {
  // zcId là string/id của coordinator bạn lưu trong DB
  return Coordinator.findOne({ _id: zcId }).lean();
}

module.exports = {
  listByUser,
  add,
  getById
  
};