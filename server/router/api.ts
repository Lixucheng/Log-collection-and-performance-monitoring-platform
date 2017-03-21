import User from '../database/user';

module.exports = router => {
  router.get('/api', async (ctx, next) => {
    var arvind = new User({
      name: 'Arvind',
      age: 99,
      DOB: '01/01/1915',
      isAlive: true
    });

    arvind.save(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('Saved : ', data);
      }
    });
    ctx.body = 'hello api';
  });
}