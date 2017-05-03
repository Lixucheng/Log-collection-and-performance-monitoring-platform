var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import db from './index';
const dateFormat = require('dateformat');
const ObjectId = db.Schema.Types.ObjectId;
const Schema = db.Schema;
const perfSchema = new Schema({
    id: ObjectId,
    creater: { type: ObjectId, ref: 'User' },
    name: String,
    type: String,
    createdAt: Date,
    users: [{ type: ObjectId, ref: 'User' }] // 成员
});
// 获取一个用户的所有项目
perfSchema.statics.getByUser = function (user, name, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = {
            users: user._id,
        };
        type ? filter['type'] = type : 0;
        name ? filter['name'] = new RegExp(name, 'i') : 0;
        const list = yield this.find(filter).populate('creater', 'name');
        const ret = [];
        yield list.reduce((pre, e, index) => __awaiter(this, void 0, void 0, function* () {
            yield pre;
            ret.push({
                name: e.name,
                type: e.type,
                createdAt: dateFormat(e.createdAt, 'yyyy-mm-dd HH:MM'),
                id: e._id,
                creater: e.creater,
            });
        }), null);
        console.log(ret);
        return ret;
    });
};
perfSchema.statics.getDetailById = function (id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.findOne({
            users: user._id,
            _id: id,
        }).populate('creater', 'name').populate('users', 'name');
    });
};
perfSchema.statics.removeByUser = function (id, user) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.remove({
            _id: id,
            creater: user._id,
        });
    });
};
perfSchema.statics.addUser = function (id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield this.findById(id);
        if (p.users.indexOf(userId) === -1) {
            p.users.push(userId);
        }
        yield p.save();
        return this.findById(id).populate('creater', 'name').populate('users', 'name');
    });
};
perfSchema.statics.removeUser = function (id, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield this.findById(id);
        if (p.creater != userId) {
            p.users = p.users.filter(e => e != userId);
            yield p.save();
        }
        return this.findById(id).populate('creater', 'name').populate('users', 'name');
    });
};
const PerfProject = db.model('PerfProject', perfSchema);
export default PerfProject;
//# sourceMappingURL=perf-project.js.map