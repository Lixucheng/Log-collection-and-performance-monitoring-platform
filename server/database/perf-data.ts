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
const ToObjectId = db.Types.ObjectId;

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

function emit(a, b) {

}

class Array {
  static avg(list) {
    return list;
  }
}


perfSchema.statics.getFilterData = async function (option) {
  const ret = await this.mapReduce({
    map: function () {
      var time = +this.time / (1000 * 60);
      emit(Math.ceil(time), this.value);
    },
    reduce: function (key, values) {
      if (values[0].type === 'counter') {
        return values.reduce((pre, curr) => pre + curr, 0);
      } else {
        return Array.avg(values);
      }
    },
    out: { inline: 1 },
    query: option
  }
  );
  console.log(ret);
  return ret;
};
async function getTagTableData (option) {
  const ret = await PerfData.mapReduce({
    map: function () {
      var time = +this.time / (1000 * 60);
      emit(Math.ceil(time), this.value);
    },
    reduce: function (key, values) {
      return values.length;
    },
    out: { inline: 1 },
    query: option
  }
  );
  console.log(ret);
  return ret;
}
perfSchema.statics.getTagValues = async function (project, tag, timeZone) {
  const match = {
    $match: {
      project: ToObjectId(project),
      // 'tags.name': { $ne: null }
    }
  };
  if (timeZone) {
    match.$match['time'] = {
      $gte: new Date(timeZone[0]),
      $lt: new Date(timeZone[1])
    }
  }
  match.$match['tags.' + tag] = { $ne: null };
  const group = {
    $group: {
      _id: {
        tagValue: ''
      }, value: { $sum: 1 }
    }
  };
  group.$group._id.tagValue = '$tags.' + tag;
  const count = await this.aggregate([
    match,
    {
      $project: {
        name: 1,
        type: 1,
        value: 1,
        tags: 1,
      }
    },
    group,
    { $sort: { value: 1 } }
  ]);

  const query = match.$match;
  const dataList = [];
  for (let i = 0; i < count.length; i++) {
    query['tags.' + tag] = count[i]._id.tagValue;
    const data = await getTagTableData(query);
    dataList.push(data);
  }
  return {
    count, dataList
  }
};

perfSchema.statics.getPerfData = async function (project, timeZone) {
  const query = {
    name: 'counter.pv',
    project,
  }
  if (timeZone) {
    query['time'] = {
      $gte: new Date(timeZone[0]),
      $lt: new Date(timeZone[1])
    }
  }
  query.name = 'counter.pv';
  console.log(query);
  const pv = await this.count(query);

  query.name = 'timing.load';
  const load = await this.mapReduce({
    map: function () {
      emit(this.name, this.value);
    },
    reduce: function (key, values) {
      return Array.avg(values);
    },
    out: { inline: 1 },
    query,
  });
  query.name = 'timing.response';
  const response = await this.mapReduce({
    map: function () {
      emit(this.name, this.value);
    },
    reduce: function (key, values) {
      return Array.avg(values);
    },
    out: { inline: 1 },
    query,
  });

  return {
    pv, load, response
  };
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
perfSchema.statics.addTag = async function (name, count) {
  const n = new Date();
  let start = +new Date(n.getFullYear(), n.getMonth(), n.getDate());
  const tags = {};
  tags[name] = Math.ceil(Math.random() * 10);
  for (let i = 0; i < 100; i++) {
    const now = new Date(start += 1000 * 60);
    console.log('addTags', tags)
    const entity = new PerfData({
      type: 'counter',
      name: 'counter.tags',
      value: 1,
      tags,
      time: now,
      project: '5905846023a7757cc466d96c'
    });
    await entity.save();
  }
};



const PerfData = db.model<IPerfData>('PerfData', perfSchema);

export default PerfData;