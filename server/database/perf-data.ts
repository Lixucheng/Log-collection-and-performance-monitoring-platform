import db from './index';

export interface IPerfData extends db.Document {
  type: string,
  name: string,
  value: number,
  tags: any,
  projectId: string,
  time: Date
}


const ObjectId = db.Schema.Types.ObjectId;

const Schema = db.Schema;
const perfSchema = new Schema({
  id: ObjectId,
  type: String,
  name: String,
  value: Number,
  tags: db.Schema.Types.Mixed,
  project: { type: ObjectId, ref: 'PerfProject' },
  time: Date
});
// 获取指标
perfSchema.statics.getAllName = async function (id) {
  const p = await this.distinct('name');
  return p;
};

perfSchema.statics.getTargetTags = async function (id, target) {
  const list = await this.find({
    project: id,
    name: target,
  });
  const ret = {};
  list.forEach(e => {
    Object.keys(e.tags).forEach(tag => {
      if (ret[tag]) {
        if (ret[tag].indexOf(e.tags[tag]) === -1) {
          ret[tag].push(e.tags[tag]);
        }
      } else {
        ret[tag] = [e.tags[tag]];
      }
    });
  });
  return ret;
};

perfSchema.statics.getAllTargetTags = async function (id) {
  const p = await this.distinct('name');
  const ret = {};
  await p.reduce(async (pre, target) => {
    await pre;
    ret[target] = await this.getTargetTags(id, target);
  }, null);
  return ret;
};



// 聚合
perfSchema.statics.test = async function (id) {
  return await this.aggregate([
    {
      $project: {
        name: 1,
        type: 1,
        value: 1,
        tags: 1
      }
    },
    { $group: { _id: { name: "$name", tags: "$tags" }, value: { $push: "$value" } } },
    { $sort: { _id: 1 } }
  ]);
};


const PerfData = db.model<IPerfData>('PerfData', perfSchema);

export default PerfData;


