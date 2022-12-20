const router = require('express').Router()
const { validateToken } = require('../middlewares/webtoken')
const commentsCotroller = require('../controllers/comments')

// CREATE comments
router.post('/add', validateToken, commentsCotroller.postComment)

// READ comments
router.get('/:name?', commentsCotroller.getComment)

// READ comments sort by name & date
router.get(':komen?', commentsCotroller.getvalComment)

// UPDATE comments
router.patch('/edit/:id?', validateToken, commentsCotroller.editComment)

// DELETE comments
router.delete('/delete/:id?', validateToken, commentsCotroller.deleteComment)

module.exports = router
