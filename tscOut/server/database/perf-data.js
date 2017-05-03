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
const perfSchema = new Schema({
    id: ObjectId,
    type: String,
    name: String,
    value: Number,
    tags: db.Schema.Types.Mixed,
    project: { type: ObjectId, ref: 'PerfProject' },
    time: Date
});
// 获取指标
perfSchema.statics.getAllName = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield this.distinct('name');
        return p;
    });
};
perfSchema.statics.getTargetTags = function (id, target) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield this.find({
            project: id,
            name: target,
        });
        const ret = {};
        list.forEach(e => {
            Object.keys(e.tags).forEach(tag => {
                if (ret[tag]) {
                    if (ret[tag].indexOf(e.tags[tag]) === -1) {
                        ret[tag].push(e.tags[tag]);
                    }
                }
                else {
                    ret[tag] = [e.tags[tag]];
                }
            });
        });
        return ret;
    });
};
perfSchema.statics.getAllTargetTags = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield this.distinct('name');
        const ret = {};
        yield p.reduce((pre, target) => __awaiter(this, void 0, void 0, function* () {
            yield pre;
            ret[target] = yield this.getTargetTags(id, target);
        }), null);
        return ret;
    });
};
function avg(list) {
    if (!list)
        return;
    const sum = list.reduce((pre, curr) => {
        return pre + curr;
    }, 0);
    return sum / list.length;
}
function emit(a, b) {
}
perfSchema.statics.getFilterData = function (option) {
    return __awaiter(this, void 0, void 0, function* () {
        const ret = yield this.mapReduce({
            map: function () {
                var time = +this.time / (1000 * 60);
                emit(Math.ceil(time), this.value);
            },
            reduce: function (key, values) {
                function avg(list) {
                    if (!list)
                        return;
                    const sum = list.reduce((pre, curr) => {
                        return pre + curr;
                    }, 0);
                    return sum / list.length;
                }
                return avg(values);
            },
            out: { inline: 1 }
        });
        console.log(ret);
        return ret;
    });
};
// 聚合
perfSchema.statics.test = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.aggregate([
            {
                $match: {
                    name: "time.1",
                }
            },
            {
                $project: {
                    name: 1,
                    type: 1,
                    value: 1,
                    tags: 1
                }
            },
            { $group: { _id: { name: "$name", tags: "$tags" }, value: { $push: "$value" } } },
            { $sort: { _id: 1 } }
        ]);
    });
};
const PerfData = db.model('PerfData', perfSchema);
export default PerfData;
//# sourceMappingURL=perf-data.js.map