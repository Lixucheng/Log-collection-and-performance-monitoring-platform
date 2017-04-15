import User from '../database/user';

module.exports = router => {
  router.get('/api/live', async (ctx, next) => {
    ctx.body = true;
  });
}
