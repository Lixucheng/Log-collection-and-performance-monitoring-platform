import db from './index';

export interface IUser extends db.Document {
  name: string;
  passWord: number;
  age?: number;
}
interface IUserDocument extends IUser,  Document {}


const ObjectId = db.Schema.Types.ObjectId;

const Schema = db.Schema;
const userSchema = new Schema({
  id: ObjectId,
  name : String,
  age : Number,
  passWord : String,
});
const User = db.model<IUser>('User', userSchema);


export default User;


