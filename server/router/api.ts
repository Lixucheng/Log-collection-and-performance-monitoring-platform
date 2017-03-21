

module.exports = router => {
  router.get('/api', async (ctx, next) => {
    ctx.body = 'hello api';
  });
}