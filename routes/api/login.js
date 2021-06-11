let express = require('express')
let router = express.Router()
let mgdb = require('../../utils/mgdb');
let bcrypt = require('../../utils/bcrypt');
let jwt = require('../../utils/jwt');

router.post('/',(req,res,next)=>{
  // res.setHeader('Access-Control-Allow-Origin', '*');//解决跨域问题
  //获取 
  let {username,password} = req.body;
  //校验
  if(!username || !password) {
    res.send({err:1,msg:'用户名密码为必传参数'})
    return;
  }

  //兜库
  mgdb.open({collectionName:'user'}).then(
    ({collection,client})=>{

      //先查用户名
      collection.find({username}).toArray((err,result)=>{
        if(err){
          res.send({err:1,msg:'集合操作失败'});
          client.close()
        }else{
          //长度大于0代表有数据
          if(result.length>0){
            //需要校验加密后的入库的密码是否和传递过来的密码一致
            let bl = bcrypt.compareSync(password,result[0].password);
            if(bl){
              //登录成功后，需要输出token，并返回给浏览器
              let token = jwt.sign({username,_id:result[0]._id})
              // delete result[0].userphone
              delete result[0].password;
              console.log(result[0]);
              res.send({err:0,msg:'登录成功',data:result[0],token})
            }else{
              res.send({err:2,msg:'用户名或者密码有误'})
            }
            client.close()
          }else{
            res.send({err:2,msg:'用户名或者密码有误'})
          }
        }
      })
    }
  )





})

module.exports = router;