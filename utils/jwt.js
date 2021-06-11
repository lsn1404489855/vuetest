let jwt = require('jsonwebtoken');

module.exports = {
  sign: ({username,_id})=>jwt.sign({username,_id}, '2101',{expiresIn: 60*60*24}),//生成令牌
  verify: token => new Promise((resolve,reject)=>{
    jwt.verify(token, '2101', (err,decode)=>{
      if(!err){
        resolve(decode)
      }else{
        reject(err.message);//err={key:value, message错误描述}
      }
    })
  })
}