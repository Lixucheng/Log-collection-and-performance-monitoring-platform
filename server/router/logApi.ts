import Device from '../database/device';
import Log from '../database/log';

module.exports = router => {
  router.post('/api/device/register', async (ctx, next) => {
    var device = new Device({
      hostName: '李续铖',
      platform: ''
    });

    await device.save();
    ctx.body = device._id;
  });
}