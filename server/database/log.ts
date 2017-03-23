import db from './index';

const Schema = db.Schema;
const logSchema = new Schema({
  id: Schema.Types.ObjectId,
  name : String,
  path : Number,
  device: Schema.Types.ObjectId,
});

const Log = db.model('Log', logSchema);


export default Log;
