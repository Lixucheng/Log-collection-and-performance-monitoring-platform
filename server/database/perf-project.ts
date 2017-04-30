import db from './index';
import User from './user';

const dateFormat = require('dateformat');

export interface IPerfProject extends db.Document {
  creater: string,
  type: string,
  name: string,
  users: string[],
  createdAt: Date,
}


const ObjectId = db.Schema.Types.ObjectId;

const Schema = db.Schema;
const perfSchema = new Schema({
  id: ObjectId,
  creater: { type: ObjectId, ref: 'User' }, // 创建人
  name: String,
  type: String, // 项目类别 as node/electron
  createdAt: Date,
  users: [{ type: ObjectId, ref: 'User' }] // 成员
});

// 获取一个用户的所有项目
perfSchema.statics.getByUser = async function (user, name, type) {
  const filter = {
    users: user._id,
  };
  type ? filter['type'] = type : 0;
  name ? filter['name'] = new RegExp(name, 'i') : 0;
  const list = await this.find(filter).populate('creater', 'name');
  const ret = [];
  await list.reduce(async (pre, e, index) => {
    await pre;
    ret.push({
      name: e.name,
      type: e.type,
      createdAt: dateFormat(e.createdAt, 'yyyy-mm-dd HH:MM'),
      id: e._id,
      creater: e.creater,
    });
  }, null);
  console.log(ret);
  return ret;
};

perfSchema.statics.getDetailById = async function (id, user) {
  return await this.findOne({
    users: user._id,
    _id: id,
  }).populate('creater', 'name').populate('users', 'name');
}
perfSchema.statics.removeByUser = async function (id, user) {
  return await this.remove({
    _id: id,
    creater: user._id,
  });
};
perfSchema.statics.addUser = async function (id, userId) {
  const p = await this.findById(id);
  if (p.users.indexOf(userId) === -1) {
    p.users.push(userId);
  }
  await p.save();
  return this.findById(id).populate('creater', 'name').populate('users', 'name');
};
perfSchema.statics.removeUser = async function (id, userId) {
  const p = await this.findById(id);
  if (p.creater != userId) {
    p.users = p.users.filter(e => e != userId);
    await p.save();
  }
  return this.findById(id).populate('creater', 'name').populate('users', 'name');
};

const PerfProject = db.model<IPerfProject>('PerfProject', perfSchema);

export default PerfProject;
