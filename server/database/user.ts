import db from './index';


var Schema = db.Schema;
var userSchema = new Schema({
  name : String,
  age : Number,
  DOB : Date,
  isAlive : Boolean
});

var User = db.model('User', userSchema);


export default User;
