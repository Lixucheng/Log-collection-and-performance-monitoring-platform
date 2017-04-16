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
  router.post('/login', async (ctx, next) => {
    console.log(ctx.session.user);
    const body = ctx.request.body;
    if (body.name && body.passWord) {
      const userList = await User.find({ name: body.name });
      if (userList.length === 0) {
        ctx.body = -1; // 不存在
      } else {
        const user = userList[0];
        if (user.passWord === body.passWord) {
          ctx.session.user = user;
          ctx.cookies.set(cookieName, JSON.stringify({ name: user.name }));
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
  router.post('/logout', async (ctx, next) => {
    console.log(ctx.session.user);
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
    } else {
      ctx.body = 1;
    }
  });
}
