import * as mongoose from 'mongoose';

// 连接字符串格式为mongodb://主机/数据库名
// mongoose.connect('mongodb://localhost/lp-platform');
mongoose.connect('mongodb://mongoDB/lp-platform');

const db = mongoose.connection;

db.on('error', function callback () {
  console.log("Connection database error");
});

db.once('open', function callback () {
  // console.log("Mongo working!");
});

export default mongoose;