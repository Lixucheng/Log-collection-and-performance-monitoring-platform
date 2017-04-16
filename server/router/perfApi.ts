import Perf from '../database/perf';

module.exports = router => {
  router.post('/api/perf/add', async (ctx, next) => {
    console.log(JSON.stringify(ctx.request.body));
    const obj = ctx.request.body;
    const data = obj.data;
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const arvind = new Perf({
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
}
