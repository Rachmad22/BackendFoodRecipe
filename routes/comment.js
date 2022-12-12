const router = require('express').Router()
const commentsCotroller = require('../controllers/comments')

// CREATE comments
router.post('/add', commentsCotroller.postComment)

// READ comments
router.get('/:name?', commentsCotroller.getComment)

// READ comments sort by name & date
router.get(':komen?', commentsCotroller.getvalComment)

// UPDATE comments
router.patch('/edit/:id?', commentsCotroller.editComment)

// DELETE comments
router.delete('/delete/:id?', commentsCotroller.deleteComment)

module.exports = router
