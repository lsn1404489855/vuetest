let express = require('express')
let mgdb = require('../../utils/mgdb')

let router = express.Router()

// router.post('/',(req,res,next)=>console.log('news',req.query,req.body,req.headers))
//新闻列表
router.get('/:name',(req,res,next)=>{
  // console.log(':name',req)

  //查询 处理 返回
  let collectionName = req.params.name;
  let {_page,_limit,_sort,q} = req.query;
  mgdb.findList({
    _page,_limit,_sort,q,collectionName
  }).then(
    result => res.send(result)
  ).catch(
    err=>res.send(err)
  )

})

//新闻详情
router.post('/:name/:_id',(req,res,next)=>{

  //查询 处理 返回
  let collectionName = req.params.name;
  console.log('集合名',req.params.name)
  let _id = req.params._id;

  mgdb.findDetail({
    collectionName,_id
  }).then(
    result => res.send(result)
  ).catch(
    err=>res.send(err)
  )

})

// router.get('/home',(req,res,next)=>console.log('news',req.query,req.body,req.headers))
// router.get('/home/1',(req,res,next)=>console.log('news',req.query,req.body,req.headers))
// router.get('/follow',(req,res,next)=>console.log('news',req.query,req.body,req.headers))
// router.get('/banner',(req,res,next)=>console.log('news',req.query,req.body,req.headers))
// router.get('/column',(req,res,next)=>console.log('news',req.query,req.body,req.headers))

module.exports = router;