import db from './index';

const ObjectId = db.Schema.Types.ObjectId;

const Schema = db.Schema;
const perfSchema = new Schema({
  id: ObjectId,
  type : String,
  name : String,
  value: Number,
  tags: String,
});

const Perf = db.model('Perf', perfSchema);


export default Perf;
