const router = require('express').Router()
const { validateCreate, validateUpdate } = require('../middlewares/validation')
const { validateToken } = require('../middlewares/webtoken')
const userController = require('../controllers/users')
const { useRedis } = require('../middlewares/redis')
// READ account by name
router.get('/:name?', validateToken, useRedis, userController.getUsers)

// // CREATE account
// router.post('/add', validateCreate, userController.postUsers)

// UPDATE by id
router.patch('/edit/:id?', validateToken, validateUpdate, userController.editUsers)

//  DELETE by id
router.delete('/delete/:id?', validateToken, userController.deleteUsers)





module.exports = router
