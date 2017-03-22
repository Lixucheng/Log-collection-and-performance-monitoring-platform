import db from './index';

const ObjectId = db.Schema.Types.ObjectId;

const Schema = db.Schema;
const userSchema = new Schema({
  id: ObjectId,
  name : String,
  age : Number,
});

const User = db.model('User', userSchema);


export default User;
