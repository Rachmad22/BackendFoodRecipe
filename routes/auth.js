const router = require('express').Router()
const { validateLogin, validateCreateUser } = require('../middlewares/validation')
const authController = require('../controllers/login')
const userController = require('../controllers/users')

router.post('/signup', validateCreateUser, userController.createUser)

router.post('/login', validateLogin, authController.login)

module.exports = router
