import User from '../database/user';
const cookieName = 'lp-platform';

module.exports = router => {
  // 注册
  router.post('/register', async (ctx, next) => {
    const body = ctx.request.body;
    if (body.name && body.passWord) {
      const has = await User.find({ name: body.name });
      if (has.length) {
        ctx.body = -1; // 已存在
      } else {
        const user = new User(body);
        await user.save();
        ctx.body = 1; // 成功
      }
    } else {
      ctx.body = 0; // 信息不完整
    }

  });

  // 登陆
  router.post('/api/login', async (ctx, next) => {
    const body = ctx.request.body;
    console.log('body', body);
    if (body.name && body.passWord) {
      const userList = await User.find({ name: body.name });
      if (userList.length === 0) {
        ctx.body = -1; // 不存在
      } else {
        const user = userList[0];
        if (user.passWord === body.passWord) {
          ctx.session.user = user;
          ctx.cookies.set(cookieName, JSON.stringify({ name: user.name }), { httpOnly: false });
          ctx.body = 1; // 成功
        } else {
          ctx.body = -2; // 密码错误
        }
      }
    } else {
      ctx.body = 0; // 信息不完整
    }

  });

  // 注销
  router.post('/api/logout', async (ctx, next) => {
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
  });

  router.get('/api/user/query', async (ctx, next) => {
    const name = ctx.query.name;
    ctx.body = await User['queryByName'](name);
  });
};

