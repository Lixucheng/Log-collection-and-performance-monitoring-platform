import db from './index';
import { EventEmitter } from 'events';

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
function avg(list) {
  if (!list) return;
  const sum = list.reduce((pre, curr) => {
    return pre + curr;
  }, 0);
  return sum / list.length;
}
function emit(a, b) {

}


perfSchema.statics.getFilterData = async function (option) {
  const ret = await this.mapReduce({
    map: function () {
      var time = +this.time / (1000 * 60);
      emit(Math.ceil(time), {
        value: this.value,
        type: this.type
      });
    },
    reduce: function (key, values) {
      function avg(list) {
        if (!list) return;
        const sum = list.reduce((pre, curr) => {
          return pre + curr.value;
        }, 0);
        return sum / list.length;
      }
      if (values[0] === 'counter') {
        return values.reduce((pre, curr) => {
          return pre + curr.value;
        }, 0);
      }
      return avg(values);
    },
    out: { inline: 1 },
    query: option
  }
  );
  // console.log(ret);
  return ret;
};



// 聚合
perfSchema.statics.test = async function (id) {
  return await this.aggregate([
    {
      $match: {
        name: "time.1",
      }
    },
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

perfSchema.statics.addData = async function (name) {
  const n = new Date();
  let start = +new Date(n.getFullYear(), n.getMonth(), n.getDate());
  for (let i = 0; i < 2000; i++) {
    const now = new Date(start += 1000 * 60);
    const entity = new PerfData({
      type: 'counter',
      name,
      value: Math.ceil(Math.random() * 10),
      tags: {
        name: Math.ceil(Math.random() * 10),
      },
      time: now,
      project: '5905846023a7757cc466d96c'
    });
    await entity.save();
  }
};



const PerfData = db.model<IPerfData>('PerfData', perfSchema);

export default PerfData;