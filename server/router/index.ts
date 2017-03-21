import * as Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';

const router: any = new Router();

// 自动加载路由
var loadDir = (dir) => {
  fs
    .readdirSync(dir)
    .forEach((file) => {
      var nextPath = path.join(dir, file);
      var stat = fs.statSync(nextPath);
      if (stat.isDirectory()) {
        loadDir(nextPath);
      } else if (stat.isFile() && file.indexOf('.') !== 0 && file !== 'index.ts') {
        require(nextPath)(router);
      }
    });
};

loadDir(__dirname);

export default router;