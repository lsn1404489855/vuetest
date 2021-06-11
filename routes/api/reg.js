let express = require('express')
let fs = require('fs')
let pathLib = require('path')
let mgdb = require('../../utils/mgdb')
let router = express.Router()
let bcrypt = require('../../utils/bcrypt')

router.post('/',(req,res,next) => {
  //获取 用户传递字段过来  username,password,nikename
  let {username,password,nikename} = req.body;

  if(!username || !password){
    res.send({
      err:1,msg:'用户名和密码为必传参数'
    })
    return
  }

  //整理 参数
  // nikename = nikename || 第三方的自动生成字符库()
  nikename = nikename || '系统自动生成';
  let follow = 0;
  let fans = 0;
  let icon = '/upload/user/1.png';//默认头像
  let time = Date.now()

  //接受传递过来的文件

  if(req.files && req.files.length>0){
    
    //改名 给图片加后缀,覆盖默认头像

    fs.renameSync(
      req.files[0].path,
      req.files[0].path + pathLib.parse(req.files[0].originalname).ext
    )

    icon = '/upload/user/' + req.files[0].filename + pathLib.parse(req.files[0].originalname).ext

  }

  //开库
  mgdb.open({collectionName:'user'}).then(
    ({collection,client})=>{
      collection.find({username}).toArray((err,result)=>{
        if(err){
          res.send({
            err:1,msg:'集合操作失败'
          })
          client.close()
        }else{
          if(result.length===0){
            password = bcrypt.hashSync(password);//加密

            //入库
            collection.insertOne({
              username,password,nikename,fans,follow,time,icon
            },(err,result)=>{
              if(!err){
                delete result.ops[0].username
                delete result.ops[0].password
                res.send({err:0,msg:'注册成功',data:result.ops[0]})
              }else{
                res.send({err:1,msg:'注册失败'})
              }
            })

          }else{

            if(icon.indexOf('default') === -1){
              fs.unlinkSync('./public'+ icon )
            }
            res.send({
              err:1,msg:'用户名已存在'
            })
            client.close()
          }
          
        }
      })
    }
  )

})

module.exports = router;