const router = require('express').Router()
const {validateRecipe, validateEditRecipe} = require('../middlewares/validation')
const recipesController = require('../controllers/recipes')

// CREATE recipes
router.post('/add', validateRecipe, recipesController.postRecipe)

// READ recipe with sorting name & date
router.get('/:name?', recipesController.getRecipes )

// UPDATE recipes
router.patch('/edit/:id?', validateEditRecipe, recipesController.editRecipes)

// DELETE recipes
router.delete('/delete/:id?', recipesController.deleteRecipes)


module.exports = router
