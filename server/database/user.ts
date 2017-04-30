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

userSchema.statics.queryByName = async function (name) {
  return await this.find({
    name: new RegExp(name, 'i')
  });
};

const User = db.model<IUser>('User', userSchema);


export default User;


