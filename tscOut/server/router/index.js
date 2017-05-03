var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';
const router = new Router();
// 心跳接口
router.get('/api/live', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    ctx.body = true;
}));
// 自动加载路由
const loadDir = (dir) => {
    fs
        .readdirSync(dir)
        .forEach((file) => {
        const nextPath = path.join(dir, file);
        const stat = fs.statSync(nextPath);
        if (stat.isDirectory()) {
            loadDir(nextPath);
        }
        else if (stat.isFile() && file.indexOf('.') !== 0 && file !== 'index.ts' && file !== 'index.js') {
            require(nextPath)(router);
        }
    });
};
loadDir(__dirname);
export default router;
//# sourceMappingURL=index.js.map