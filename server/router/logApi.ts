import Device from '../database/device';
import Log from '../database/log';
import * as path from 'path';
const config =  require('../../config');
const root  = require('../../helpers/root').root;
const fs =  require('../../helpers/fs');

const logDir = root(config.logDir);
module.exports = router => {
  router.post('/api/device/register', async (ctx, next) => {
    var device = new Device({
      hostName: '李续铖',
      platform: ''
    });

    await device.save();
    ctx.body = device._id;
  });

  // 获取服务器日志列表
  router.get('/api/log/list/:deviceId', async (ctx, next) => {
    const deviceId = ctx.params.deviceId;
    const page = ctx.query.page;
    const startTime = ctx.query.startTime;
    const endTime = ctx.query.endTime;
    const ret = [];

    const files = await fs.readdir(logDir);
    await files.reduce(async (p, file) => {
      await p;
      if (path.extname(file) === '.txt') {
        const stat = await fs.stat(path.join(logDir, file));
        if (startTime && endTime) {
          if (stat.birthtime >= new Date(startTime)
            && stat.birthtime <= new Date(endTime)) {
            ret.push(file);
          }
        } else {
          ret.push(file);
        }
      }
    }, null);

    ctx.body = ret;
  });
};
