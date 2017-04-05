import * as fs from 'fs';
import * as path from 'path';
const multer = require('koa-multer');
const config = require('../../config');
const root  = require('../../helpers/root').root;

const uploadDir = root(config.logDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const newFileName = (filename) => {
  let ret: string;
  let newfilename: string;
  do {
    filename = filename.replace(/\s+/g, '');
    newfilename = `${Math.floor(Math.random() * 10000000)}-${filename}`;
    ret = path.join(uploadDir, newfilename);
  } while (fs.exists(ret));
  return newfilename;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, newFileName(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = (router) => {
  router.post('/upload', upload.single('file'), async (ctx, next) => {
    const newname = ctx.req.file;
    console.log('upload:', ctx.req.file.path);
    ctx.body = {
      success: true,
      file_path: `/upload/${newname}`
    };
  });
};
