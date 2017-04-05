import * as Router from 'koa-router';
import * as fs from 'fs';
import * as path from 'path';

const router: any = new Router();

// 自动加载路由
const loadDir = (dir) => {
  fs
    .readdirSync(dir)
    .forEach((file) => {
      const nextPath = path.join(dir, file);
      const stat = fs.statSync(nextPath);
      if (stat.isDirectory()) {
        loadDir(nextPath);
      } else if (stat.isFile() && file.indexOf('.') !== 0 && file !== 'index.ts' && file !== 'index.js') {
        require(nextPath)(router);
      }
    });
};

loadDir(__dirname);

export default router;
