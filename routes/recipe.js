const router = require('express').Router()
const {validateRecipe, validateEditRecipe} = require('../middlewares/validation')
const { validateToken } = require('../middlewares/webtoken')
const recipesController = require('../controllers/recipes')

// CREATE recipes
router.post('/add', validateToken, validateRecipe, recipesController.postRecipe)

// READ recipe with sorting name & date
router.get('/:name?', recipesController.getRecipes )

// UPDATE recipes
router.patch('/edit/:id?',validateToken, validateEditRecipe, recipesController.editRecipes)

// DELETE recipes
router.delete('/delete/:id?', validateToken, recipesController.deleteRecipes)


module.exports = router
