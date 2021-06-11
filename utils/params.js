let jwt = require('./jwt');

module.exports = (req,res,next) => {
  // console.log('params');

  //处理公共参数  address !address headers
  req.query._page = req.query._page ? req.query._page - 1 : require('../config/query-ruls')._page;
  req.query._limit = req.query._limit ? req.query._limit - 0 : require('../config/query-ruls')._limit;
  req.query.q = req.query.q ? req.query.q : require('../config/query-ruls').q;
  req.query._sort = req.query._sort ? req.query._sort: require('../config/query-ruls')._sort;

  req.body._page = req.body._page ? req.body._page - 1 : require('../config/query-ruls')._page;
  req.body._limit = req.body._limit ? req.body._limit - 1 : require('../config/query-ruls')._limit;
  req.body.q = req.body.q ? req.body.q : require('../config/query-ruls').q;
  req.body._sort = req.body._sort ? req.body._sort: require('../config/query-ruls')._sort;


  req.header._page = req.header._page ? req.header._page - 1 : require('../config/query-ruls')._page;
  req.header._limit = req.header._limit ? req.header._limit - 1 : require('../config/query-ruls')._limit;
  req.header.q = req.header.q ? req.header.q : require('../config/query-ruls').q;
  req.header._sort = req.header._sort ? req.header._sort: require('../config/query-ruls')._sort;

  //处理token统一校验
  if(/login|reg|logout/.test(req.url)){
    
    next()

  }else{

    let token = req.headers.token || req.body.token || req.query.token
    
    jwt.verify(token).then(
      decode => {
        req.detoken = decode//向下传递一个detoken属性，存储的是明文token
        next()
      }
    ).catch(
      message => res.send({err:2,msg:'token校验失败或者过期'+message})
    )
  }

  //设置一部分接口被允许跨域

}