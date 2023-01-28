const router = require('express').Router()
const { validateLogin } = require('../middlewares/validation')
const authController = require('../controllers/login')


router.post('/login', validateLogin, authController.login)

module.exports = router