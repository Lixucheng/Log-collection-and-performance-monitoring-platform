var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from './index';
const ObjectId = db.Schema.Types.ObjectId;
const Schema = db.Schema;
const userSchema = new Schema({
    id: ObjectId,
    name: String,
    age: Number,
    passWord: String,
});
userSchema.statics.queryByName = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.find({
            name: new RegExp(name, 'i')
        });
    });
};
const User = db.model('User', userSchema);
export default User;
//# sourceMappingURL=user.js.map