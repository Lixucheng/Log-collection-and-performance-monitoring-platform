import db from './index';

const Schema = db.Schema;
const deviceSchema = new Schema({
  id: Schema.Types.ObjectId,
  hostName : String,
  platform : String,
  data: String
});

const Device = db.model('User', deviceSchema);

export default Device;
