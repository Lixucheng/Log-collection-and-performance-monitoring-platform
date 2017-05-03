var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as path from 'path';
import Socket from '../service/socket';
const config = require('../../config');
const root = require('../../helpers/root').root;
const fs = require('../../helpers/fs');
const logDir = root(config.logDir);
module.exports = router => {
    router.post('/api/device/register', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    }));
    // 获取服务器日志列表
    router.get('/api/log/list/:deviceId', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        console.log('session:', ctx.session.user);
        const deviceId = ctx.params.deviceId;
        const page = +ctx.query.page || 0;
        const startTime = +ctx.query.startTime;
        const endTime = +ctx.query.endTime;
        const ret = [];
        const files = yield fs.readdir(logDir);
        yield files.reduce((p, file) => __awaiter(this, void 0, void 0, function* () {
            yield p;
            if (path.extname(file) === '.txt') {
                const time = file.split('-')[2].split('_').join('-');
                if (startTime && endTime) {
                    if (new Date(time) >= new Date(startTime)
                        && new Date(time) <= new Date(endTime)) {
                        ret.push(file);
                    }
                }
                else {
                    ret.push(file);
                }
            }
        }), null);
        ret.sort((a, b) => {
            const data1 = new Date(a.split('-')[2].split('_').join('-'));
            const data2 = new Date(b.split('-')[2].split('_').join('-'));
            return +data2 - +data1;
        });
        ctx.body = {
            total: Math.ceil(ret.length / 20),
            list: ret.splice(page * 20 - 20, 20)
        };
    }));
    // 向客户端发送请求
    router.get('/api/log/request/:deviceId', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        const deviceId = ctx.params.deviceId;
        const startTime = +ctx.query.startTime;
        const endTime = +ctx.query.endTime;
        console.log(startTime, startTime);
        ctx.body = Socket.sendRequest(deviceId, startTime, endTime);
    }));
};
//# sourceMappingURL=logApi.js.map