import * as Koa from 'koa';
import * as serve from 'koa-static';
import router from './router';
import Socket from './service/socket';
const views = require('koa-views');

const helpers = require('../helpers/root');
const app = new Koa();

app.use(async (ctx, next) => {
  const start: any = new Date();
  await next();
  const end: any = new Date();
  const ms: any = end - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

app.use(serve(helpers.root('dist')));

// Must be used before any router is used
app.use(views(helpers.root('dist'), {}));


app.use(router.routes())
   .use(router.allowedMethods());


// 如果不是请求api，全部返回index.html
app.use(async(ctx, next) => {
  await next();
  if ((!/\/api.*/.test(ctx.url))) {
    await ctx['render']('index');
  }
});

app.listen(3000);
console.log('listening on port 3000');

const socket = new Socket();
