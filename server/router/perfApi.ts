import PerfData from '../database/perf-data';
import PerfProject from '../database/perf-project';

module.exports = router => {
  router.post('/api/perf/add', async (ctx, next) => {
    console.log(JSON.stringify(ctx.request.body));
    const obj = ctx.request.body;
    const data = obj.data;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const arvind = new PerfData({
        type: item.type,
        name: Object.keys(item.metrics)[0],
        value: item.metrics[Object.keys(item.metrics)[0]],
        tags: JSON.stringify(item.tags),
      });
      await arvind.save();
      console.log(arvind);
    }
    // const lxc = await User.findOne({name: '李续铖'});
    // console.log('findOne:', lxc);

    ctx.body = true;
  });

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
}
