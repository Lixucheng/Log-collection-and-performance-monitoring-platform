import * as Koa from 'koa';
import * as serve from 'koa-static';
import router from './router';
import Socket from './service/socket';
import * as session from 'koa-session-minimal';

const views = require('koa-views');
const body = require('koa-bodyparser');
const redisStore = require('koa-redis');

var compress = require('koa-compress')
var etag = require('koa-etag');

const helpers = require('../helpers/root');
const app = new Koa();

app.use(async (ctx, next) => {
  const start: any = new Date();
  await next();
  const end: any = new Date();
  const ms: any = end - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(compress({
  filter: function (content_type) {
    return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

app.use(etag());

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
app.use(async (ctx, next) => {
  await next();
  const user = ctx['session'] && ctx['session'].user;
  if ((!/\/api.*/.test(ctx.url))) {
    if (!(/\/login.*/.test(ctx.url)) && !user && !(/\/register.*/.test(ctx.url))) {
      ctx.redirect('/login');
    } else {
      await ctx['render']('index');
    }
  }
});

app.listen(3000);
console.log('listening on port 3000');

Socket.init();
