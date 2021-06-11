let express = require('express')

let router = express.Router()

router.get('/',()=>console.log('logout'))

module.exports = router;