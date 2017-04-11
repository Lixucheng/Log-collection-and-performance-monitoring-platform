import Device from '../database/device';
import Log from '../database/log';
import * as path from 'path';
const config = require('../../config');
const root = require('../../helpers/root').root;
const fs = require('../../helpers/fs');

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
    const page = +ctx.query.page || 0;
    const startTime = +ctx.query.startTime;
    const endTime = +ctx.query.endTime;
    const ret = [];

    const files = await fs.readdir(logDir);
    await files.reduce(async (p, file) => {
      await p;
      if (path.extname(file) === '.txt') {
        const time = file.split('-')[2].split('_').join('-');
        if (startTime && endTime) {
          if (new Date(time) >= new Date(startTime)
            && new Date(time) <= new Date(endTime)) {
            ret.push(file);
          }
        } else {
          ret.push(file);
        }
      }
    }, null);


    ctx.body = {
      total: Math.ceil(ret.length / 20),
      list: ret.splice(page * 20 - 20, 20)
    };
  });

  // 获取服务器日志列表
  router.get('/api/log/request/:deviceId', async (ctx, next) => {
    const deviceId = ctx.params.deviceId;
    const startTime = +ctx.query.startTime;
    const endTime = +ctx.query.endTime;

    console.log(startTime, startTime);

    ctx.body = 1;
  });
};
