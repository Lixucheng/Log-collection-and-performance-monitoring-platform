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
  router.get('/api/log/list/:deviceid', async (ctx, next) => {
    const deviceId = this.params.deviceid;
    const page = this.query.page;
    const startTime = this.query.startTime;
    const endTime = this.query.endTime;
    const ret = [];

    const files = await this.fs.readdir(logDir);
    files.reduce(async (p, file) => {
      await p;
      if (this.getFileType(file) === '.txt') {
        const stat = await this.fs.stat(path.join(logDir, file));
        if (startTime && endTime) {
          if (stat.birthtime >= new Date(startTime)
            && stat.birthtime <= new Date(endTime)) {
            ret.push(path.join(logDir, file));
          }
        } else {
          ret.push(path.join(this.dir, file));
        }
      }
    }, null);

    console.log(ret);
    ctx.body = ret;
  });
};
