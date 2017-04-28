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

perfSchema.statics.getByUser = async function (user, name, type) {
  const filter = {
    users: user._id,
  };
  type ? filter['type'] = type : 0;
  name ? filter['name'] = new RegExp(name, 'i'): 0;
  const list = await this.find(filter);
  const ret = [];
  await list.reduce(async (pre, e, index) => {
    await pre;
    const creater = await User.findById(e.creater)
    ret.push({
      name: e.name,
      type: e.type,
      createdAt: dateFormat(e.createdAt, 'yyyy-mm-dd HH:MM'),
      id: e._id,
      creater,
    });
  }, null);
  console.log(ret.length, filter);
  
  return ret;
};
perfSchema.statics.removeByUser = async function (id, user) {
  return await this.remove({
    _id: id,
    creater: user._id,
  });
};

const PerfProject = db.model<IPerfProject>('PerfProject', perfSchema);

export default PerfProject;
