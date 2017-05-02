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


  const perpage = 1000;
  router.post('/api/perf/data/add', async (ctx, next) => {
    const obj = ctx.request.body;
    const data = obj.data;
    console.log(JSON.stringify(obj));
    await data.reduce(async (p, item) => {
      await p;
      await Object.keys(item.metrics).reduce(async (perf, curr) => {
        await perf;
        const entity = new PerfData({
          type: item.type,
          name: curr,
          value: item.metrics[curr],
          tags: item.tags,
          time: new Date,
          project: obj.env.token
        });
        await entity.save();
      }, null);
    }, null);
    // const lxc = await User.findOne({name: '李续铖'});
    // console.log('findOne:', lxc);
    ctx.body = true;
  });

  router.get('/api/perf/data/namelist', async (ctx, next) => {
    const id = ctx.query.id;
    const page = ctx.query.page;
    const key = ctx.query.key;
    let list = await PerfData['getAllName'](id);
    if (key) {
      list = list.filter(e => e.indexOf(key) > -1);
    }
    ctx.body = {
      total: Math.ceil(list.length / perpage),
      list: list.splice(page * perpage - perpage, perpage)
    };
  });

  router.get('/api/perf/data/targetData', async (ctx, next) => {
    const id = ctx.query.id;
    const target = ctx.query.target;
    ctx.body = await PerfData['getTargetTags'](id, target);
  });

  router.get('/api/perf/data/getAllTargetTags', async (ctx, next) => {
    const id = ctx.query.id;
    ctx.body = await PerfData['getAllTargetTags'](id);
  });

  router.get('/api/perf/data/test', async (ctx, next) => {
    const id = ctx.query.id;
    const target = ctx.query.target;
    ctx.body = await PerfData['getAllTargetTags'](id, target);
  });
};

