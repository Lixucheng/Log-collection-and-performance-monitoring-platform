import db from './index';

export interface IPerfData extends db.Document {
  type: string,
  name: string,
  value: number,
  tags: string,
}


const ObjectId = db.Schema.Types.ObjectId;

const Schema = db.Schema;
const perfSchema = new Schema({
  id: ObjectId,
  type: String,
  name: String,
  value: Number,
  tags: String,
});

const PerfData = db.model<IPerfData>('PerfData', perfSchema);

export default PerfData;
