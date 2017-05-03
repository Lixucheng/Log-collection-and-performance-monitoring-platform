var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PerfData from '../database/perf-data';
import PerfProject from '../database/perf-project';
const test = require('../database/test.js');
module.exports = router => {
    router.post('/api/perf/projects/add', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const user = ctx.session.user;
        const body = ctx.request.body;
        const has = yield PerfProject.findOne({ name: body.name, type: body.type });
        if (has) {
            ctx.body = -1;
        }
        else {
            const project = new PerfProject({
                creater: user._id,
                type: body.type,
                name: body.name,
                users: [user._id],
                createdAt: new Date(),
            });
            ctx.body = yield project.save();
        }
    }));
    router.get('/api/perf/projects/list', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const user = ctx.session.user;
        const query = ctx.query;
        ctx.body = yield PerfProject['getByUser'](user, query.name, query.type);
    }));
    router.get('/api/perf/projects/remove', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const user = ctx.session.user;
        const id = ctx.query.id;
        ctx.body = yield PerfProject['removeByUser'](id, user);
    }));
    router.get('/api/perf/projects/detail', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const user = ctx.session.user;
        const id = ctx.query.id;
        ctx.body = yield PerfProject['getDetailById'](id, user);
    }));
    router.get('/api/perf/projects/addUser', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const id = ctx.query.id;
        const userId = ctx.query.userId;
        ctx.body = yield PerfProject['addUser'](id, userId);
    }));
    router.get('/api/perf/projects/removeUser', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const id = ctx.query.id;
        const userId = ctx.query.userId;
        ctx.body = yield PerfProject['removeUser'](id, userId);
    }));
    const perpage = 1000;
    router.post('/api/perf/data/add', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const obj = ctx.request.body;
        const data = obj.data;
        console.log(JSON.stringify(obj));
        yield data.reduce((p, item) => __awaiter(this, void 0, void 0, function* () {
            yield p;
            yield Object.keys(item.metrics).reduce((perf, curr) => __awaiter(this, void 0, void 0, function* () {
                yield perf;
                const entity = new PerfData({
                    type: item.type,
                    name: curr,
                    value: item.metrics[curr],
                    tags: item.tags,
                    time: new Date,
                    project: obj.env.token
                });
                yield entity.save();
            }), null);
        }), null);
        // const lxc = await User.findOne({name: '李续铖'});
        // console.log('findOne:', lxc);
        ctx.body = true;
    }));
    router.get('/api/perf/data/namelist', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const id = ctx.query.id;
        const page = ctx.query.page;
        const key = ctx.query.key;
        let list = yield PerfData['getAllName'](id);
        if (key) {
            list = list.filter(e => e.indexOf(key) > -1);
        }
        ctx.body = {
            total: Math.ceil(list.length / perpage),
            list: list.splice(page * perpage - perpage, perpage)
        };
    }));
    router.get('/api/perf/data/targetData', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const id = ctx.query.id;
        const target = ctx.query.target;
        ctx.body = yield PerfData['getTargetTags'](id, target);
    }));
    router.get('/api/perf/data/getAllTargetTags', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const id = ctx.query.id;
        ctx.body = yield PerfData['getAllTargetTags'](id);
    }));
    /* {
        'time.1': {
            deviceOs: {
              open: false,
              value: 'darwin-x64'
            },
            name: {
              open: false,
              value: 'lxc'
            }
        }
      } */
    router.post('/api/perf/data/getFilterData', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        console.log(ctx.request.body);
        const body = ctx.request.body;
        const ret = [];
        const targets = Object.keys(body);
        for (let i = 0; i < targets.length; i++) {
            const query = {
                name: targets[i],
            };
            const target = body[targets[i]];
            const tags = Object.keys(target);
            for (let j = 0; j < tags.length; j++) {
                const tag = target[tags[j]];
                if (tag.open && tag.value) {
                    query['tags.' + tags[j]] = tag.value;
                }
            }
            const data = yield PerfData['getFilterData'](query);
            ret.push(data);
        }
        console.log(ret);
        ctx.body = 1;
    }));
    router.get('/api/perf/data/test', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const id = ctx.query.id;
        const target = ctx.query.target;
        ctx.body = yield PerfData['getAllTargetTags'](id, target);
    }));
};
//# sourceMappingURL=perfApi.js.map