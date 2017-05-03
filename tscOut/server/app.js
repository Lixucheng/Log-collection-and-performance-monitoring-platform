var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Koa from 'koa';
import * as serve from 'koa-static';
import router from './router';
import Socket from './service/socket';
import * as session from 'koa-session-minimal';
const views = require('koa-views');
const body = require('koa-bodyparser');
const redisStore = require('koa-redis');
const helpers = require('../helpers/root');
const app = new Koa();
app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
    const start = new Date();
    yield next();
    const end = new Date();
    const ms = end - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
}));
app.use(session({
    store: redisStore()
}));
app.use(body());
app.use(serve(helpers.root('public')));
// Must be used before any router is used
app.use(views(helpers.root('public', 'dist'), {}));
app.use(router.routes())
    .use(router.allowedMethods());
// 如果不是请求api，全部返回index.html
app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
    yield next();
    const user = ctx['session'] && ctx['session'].user;
    if ((!/\/api.*/.test(ctx.url))) {
        if (!(/\/login.*/.test(ctx.url)) && !user) {
            console.log('跳转');
            ctx.redirect('/login');
        }
        else {
            yield ctx['render']('index');
        }
    }
}));
app.listen(3000);
console.log('listening on port 3000');
Socket.init();
//# sourceMappingURL=app.js.map