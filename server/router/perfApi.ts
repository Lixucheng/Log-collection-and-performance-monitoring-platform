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


  /* {
      'time.1': {
          deviceOs: {
            open: false,
            value: 'darwin-x64'
          },
          name: {
            open: false,
            value: 'lxc'
          }
      }
    } */
  router.post('/api/perf/data/getFilterData', async (ctx, next) => {
    console.log(ctx.request.body);
    const body = ctx.request.body.option;
    const timeZone = ctx.request.body.timeZone;
    const project = ctx.request.body.project;

    const ret = [];
    const targets = Object.keys(body);
    for (let i = 0; i < targets.length; i++) {
      const query = {
        project,
        name: targets[i],
        time: { $gt: new Date(timeZone[0]), $lt: new Date(timeZone[1]) },
      }
      const target = body[targets[i]];
      const tags = Object.keys(target);
      for (let j = 0; j < tags.length; j++) {
        const tag = target[tags[j]];
        if (tag.open && tag.value) {
          query['tags.' + tags[j]] = tag.value;
        }
      }
      console.log('query:', query);
      const one = await PerfData.findOne(query)
      const data = await PerfData['getFilterData'](query);
      // console.log('data:', data);
      if (data && data.length) {
        ret.push({
          name: targets[i],
          data: format(data, timeZone, one && one.type),
        });
      }
    }
    // console.log(ret);
    ctx.body = ret;
  });

  /*[ {value: ; _id: } ]*/
  function format(data, timeZone, type) {
    console.log('type:', type);
    // console.log('format', data);
    let start = +new Date(timeZone[0]);
    const finial = +new Date(timeZone[1]);
    const count = Math.ceil(((+new Date(timeZone[1])) - (+new Date(timeZone[0]))) / 60000);
    const zone = Math.ceil(count / 100); // 分钟
    const obj = {};
    while (start + zone * 60 * 1000 <= finial) {
      const now = new Date(start);
      const end = start + zone * 60 * 1000;
      const list = data.filter(e => e._id * 60000 >= start && e._id * 60000 < end);
      // console.log('add one:', list.length, list)
      const name = [now.getMonth() + 1, now.getDate()].join('-') + ' ' + now.getHours() + ':' + now.getMinutes();
      if (type === 'counter') {
        obj[name] = list.reduce((pre, cur) => {
          return pre + cur.value;
        }, 0);
      } else {
        obj[name] = avg(list);
      }
      start += zone * 60 * 1000;
    }
    // console.log('format', obj)
    return obj;
  }
  function avg(list) {
    if (list.length === 0) return 0;
    const sum = list.reduce((pre, curr) => {
      // console.log(pre, curr)
      return pre + curr.value;
    }, 0);
    if (sum == 0) return 0;
    return sum / list.length;
  }

  
  function tagformat(data, timeZone, type) {
    console.log('type:', type);
    // console.log('format', data);
    let start = +new Date(timeZone[0]);
    const finial = +new Date(timeZone[1]);
    const count = Math.ceil(((+new Date(timeZone[1])) - (+new Date(timeZone[0]))) / 60000);
    const zone = Math.ceil(count / 100); // 分钟
    const obj = {};
    while (start + zone * 60 * 1000 <= finial) {
      const now = new Date(start);
      const end = start + zone * 60 * 1000;
      const list = data.filter(e => e._id * 60000 >= start && e._id * 60000 < end);
      // console.log('add one:', list.length, list)
      const name = [now.getMonth() + 1, now.getDate()].join('-') + ' ' + now.getHours() + ':' + now.getMinutes();
      obj[name] = list.length;
      start += zone * 60 * 1000;
    }
    // console.log('format', obj)
    return obj;
  }
  router.get('/api/perf/data/getTagValues', async (ctx, next) => {
    const id = ctx.query.id;
    const tag = ctx.query.tag;
    const timeZone = ctx.query.timeZone;
    console.log(ctx.query)
    const data = await PerfData['getTagValues'](id, tag, timeZone);
    data.dataList.forEach((e, i, array) => {
      array[i] = tagformat(e, timeZone, 'counter');
    });
    ctx.body = data;
  });

  router.get('/api/perf/data/getPerfData', async (ctx, next) => {
    const id = ctx.query.id;
    const timeZone = ctx.query.timeZone;
    console.log('query:', ctx.query)
    const data = await PerfData['getPerfData'](id, timeZone);
    data.load = data.load && data.load.length && data.load[0].value.toFixed(0);
    data.response = data.response  && data.response.length && data.response[0].value.toFixed(0);
    ctx.body = data;
  });

  router.get('/api/perf/data/test', async (ctx, next) => {
    const id = ctx.query.id;
    const target = ctx.query.target;
    // await PerfData['addTag']('browser');
    // await PerfData['addTag']('deviceOs');
    // ctx.body = await PerfData['addTag']('page');
    ctx.body = await PerfData['getTagValues']('5905846023a7757cc466d96c', 'page')
  });
};

