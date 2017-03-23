import User from '../database/user';

module.exports = router => {
  router.get('/api', async (ctx, next) => {
    var arvind = new User({
      name: '李续铖',
      age: 99,
      school: 23333
    });

    await arvind.save();
    const lxc = await User.findOne({name: '李续铖'});
    console.log('findOne:',lxc);

    ctx.body = 'hello api';
  });
}