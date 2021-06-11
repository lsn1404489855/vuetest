let bcrypt = require('bcrypt');

module.exports = {
  hashSync: password => bcrypt.hashSync(password, 10),
  compareSync: (sendPassWord,hash) => bcrypt.compareSync(sendPassWord, hash)
}