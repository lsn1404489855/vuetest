var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var multer  = require('multer');//引入包  类
//设置存储位置
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if(req.url.indexOf('user') !== -1 || req.url.indexOf('reg') !== -1){
      cb(null, path.join(__dirname,'public','upload','user'))
    }else if(req.url.includes('banner')){
      cb(null, path.join(__dirname,'public','upload','banner'))
    }else{
      cb(null, path.join(__dirname,'public','upload','news'))
    }
  }
})

let upload  = multer({ storage});

//创建web服务器
var app = express();

//安装中间件

app.use(upload.any()); 
  // 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
  //设置日志
app.use(logger('dev'));

  //配置bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//多资源托管
app.use(express.static(path.join(__dirname, 'public','template')));
app.use('/supervisor',express.static(path.join(__dirname, 'public','admin')));
app.use(express.static(path.join(__dirname, 'public')));


//响应 -- 客户端
app.all('/api/*', require('./utils/params'));
app.use('/api/goods',require('./routes/api/goods'));
app.use('/api/reg',require('./routes/api/reg'));
app.use('/api/login',require('./routes/api/login'));
app.use('/api/user',require('./routes/api/user'));
app.use('/api/logout',require('./routes/api/logout'));
// app.use('/api/send-code',require('./routes/api/send-code'));

//响应 -- 客户端

// 处理错误
app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);

  if(req.url.includes('/api')){// 用户端接口不存在 返回  {err:1,msg:'不存在的接口'}
    res.send({err:1,msg:'不存在的接口'})
  }else if(req.url.includes('/admin')){// 管理端接口不存在 返回  res.render('error.ejs')
    res.render('error');
  }else{ // 资源托管没有对应的页面 返回 404.html
    // console.log('1111');
    res.sendFile(path.join(__dirname,'public','template','index.html'))
  }
});

module.exports = app;
