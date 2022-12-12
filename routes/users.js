const router = require('express').Router()
const { validateCreate, validateUpdate } = require('../middlewares/validation')
const userController = require('../controllers/users')
// READ account by name
router.get('/:name?', userController.getUsers)

// CREATE account
router.post('/add', validateCreate, userController.postUsers)

// UPDATE by id
router.patch('/edit/:id?', validateUpdate, userController.editUsers)

//  DELETE by id
router.delete('/delete/:id?', userController.deleteUsers)





module.exports = router
