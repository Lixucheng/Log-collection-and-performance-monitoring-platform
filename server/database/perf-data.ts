import db from './index';

export interface IPerfData extends db.Document {
  type: string,
  name: string,
  value: number,
  tags: string,
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
  tags: String,
  project: { type: ObjectId, ref: 'PerfProject' },
  time: Date
});
// 获取指标
perfSchema.statics.getAllName = async function (id) {
  const p = await this.distinct('name');
  return p;
};
const PerfData = db.model<IPerfData>('PerfData', perfSchema);

export default PerfData;


