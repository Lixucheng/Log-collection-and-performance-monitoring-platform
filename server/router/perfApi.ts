import PerfData from '../database/perf-data';
import PerfProject from '../database/perf-project';

module.exports = router => {
  router.post('/api/perf/projects/add', async (ctx, next) => {
    const user = ctx.session.user;
    const body = ctx.request.body;
    const has = await PerfProject.findOne({ name: body.name, type: body.type });

    if (has) {
      ctx.body = -1;
    } else {
      const project = new PerfProject({
        creater: user._id,
        type: body.type,
        name: body.name,
        users: [user._id],
        createdAt: new Date(),
      });
      ctx.body = await project.save();
    }
  });

  router.get('/api/perf/projects/list', async (ctx, next) => {
    const user = ctx.session.user;
    const query = ctx.query;
    ctx.body = await PerfProject['getByUser'](user, query.name, query.type);
  });

  router.get('/api/perf/projects/remove', async (ctx, next) => {
    const user = ctx.session.user;
    const id = ctx.query.id;
    ctx.body = await PerfProject['removeByUser'](id, user);
  });
  router.get('/api/perf/projects/detail', async (ctx, next) => {
    const user = ctx.session.user;
    const id = ctx.query.id;
    ctx.body = await PerfProject['getDetailById'](id, user);
  });
  router.get('/api/perf/projects/addUser', async (ctx, next) => {
    const id = ctx.query.id;
    const userId = ctx.query.userId;
    ctx.body = await PerfProject['addUser'](id, userId);
  });
  router.get('/api/perf/projects/removeUser', async (ctx, next) => {
    const id = ctx.query.id;
    const userId = ctx.query.userId;
    ctx.body = await PerfProject['removeUser'](id, userId);
  });


  router.post('/api/perf/data/add', async (ctx, next) => {
    const obj = ctx.request.body;
    const data = obj.data;
    await data.reduce(async (p, item) => {
      await p;
      const entity = new PerfData({
        type: item.type,
        name: Object.keys(item.metrics)[0],
        value: item.metrics[Object.keys(item.metrics)[0]],
        tags: JSON.stringify(item.tags),
        time: new Date,
        project: obj.env.token
      });
      await entity.save();
    }, null);
    // const lxc = await User.findOne({name: '李续铖'});
    // console.log('findOne:', lxc);
    ctx.body = true;
  });
  router.get('/api/perf/data/namelist', async (ctx, next) => {
    const id = ctx.query.id;
    const page = ctx.query.page;
    ctx.body = await PerfData['getAllName'](id);

    // ctx.body = await PerfData.collection.group({ name: true }, function() {}, { });
  });
}
