var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../database/user';
const cookieName = 'lp-platform';
module.exports = router => {
    // 注册
    router.post('/register', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const body = ctx.request.body;
        if (body.name && body.passWord) {
            const has = yield User.find({ name: body.name });
            if (has.length) {
                ctx.body = -1; // 已存在
            }
            else {
                const user = new User(body);
                yield user.save();
                ctx.body = 1; // 成功
            }
        }
        else {
            ctx.body = 0; // 信息不完整
        }
    }));
    // 登陆
    router.post('/api/login', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const body = ctx.request.body;
        console.log('body', body);
        if (body.name && body.passWord) {
            const userList = yield User.find({ name: body.name });
            if (userList.length === 0) {
                ctx.body = -1; // 不存在
            }
            else {
                const user = userList[0];
                if (user.passWord === body.passWord) {
                    ctx.session.user = user;
                    ctx.cookies.set(cookieName, JSON.stringify({ name: user.name }), { httpOnly: false });
                    ctx.body = 1; // 成功
                }
                else {
                    ctx.body = -2; // 密码错误
                }
            }
        }
        else {
            ctx.body = 0; // 信息不完整
        }
    }));
    // 注销
    router.post('/api/logout', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const body = ctx.request.body;
        const sessionUser = ctx.session.user;
        if (body.name) {
            if (sessionUser && sessionUser.name === body.name) {
                ctx.session.user = null;
                let lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                ctx.cookies.set(cookieName, null, {
                    expires: lastMonth
                });
            }
        }
        ctx.body = 1;
    }));
    router.get('/api/user/query', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const name = ctx.query.name;
        ctx.body = yield User['queryByName'](name);
    }));
};
//# sourceMappingURL=user.js.map