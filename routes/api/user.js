let express = require('express')
let mgdb = require('../../utils/mgdb')

let router = express.Router()

router.get('/',(req,res,next)=>{

  // 开库
  mgdb.open({collectionName:'user'}).then(
    ({collection,client,ObjectId})=>{
      // 根据token 写带的id和用户名查询是否存在
      collection.find({username:req.detoken.username,_id:ObjectId(req.detoken._id)}).toArray(
        (err,result)=>{
          if(err){
            res.send({err:1,msg:'集合操作失败'})
          }else{
            console.log('es',result);
            if(result.length>0){
              //返回给客户端的信息里，不应含有username和password
              delete result[0].username;
              delete result[0].password;
              res.send({err:0,msg:'成功',data:result[0]})
            }else{
              res.send({err:1,msg:'自动登录失败'})
            }
          }
          client.close()
        }
      )
    }
  )
})

module.exports = router;